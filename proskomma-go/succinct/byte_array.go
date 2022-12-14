package succinct

import (
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
)

type ByteArray struct {
	ByteArray []uint8
}

func NewByteArray(size uint) ByteArray {
	return ByteArray{
		ByteArray: make([]uint8, 0, size),
	}
}

func NewByteArrayFromBase64(s string) (ByteArray, error) {
	bytes, err := b64.StdEncoding.DecodeString(s)
	if err != nil {
		return ByteArray{}, err
	}
	ba := NewByteArray(uint(len(bytes)))
	ba.ByteArray = bytes
	return ba, nil
}

func (ba *ByteArray) Length() int {
	return len(ba.ByteArray)
}

func (ba *ByteArray) Byte(n int) (uint8, error) {
	if n >= len(ba.ByteArray) {
		return 0, fmt.Errorf(
			"attempt to read byte %d (length %d)",
			n,
			len(ba.ByteArray),
		)
	}
	return ba.ByteArray[n], nil
}

func (ba *ByteArray) Bytes(n int, l int) ([]uint8, error) {
	if (n + l) > len(ba.ByteArray) {
		return []uint8{}, fmt.Errorf(
			"attempt to read %d bytes from %d (length %d)",
			l,
			n,
			len(ba.ByteArray),
		)
	}
	return ba.ByteArray[n : n+l], nil
}

func (ba *ByteArray) SetByte(n int, v uint8) error {
	if n >= len(ba.ByteArray) {
		return fmt.Errorf(
			"attempt to set byte %d (length %d)",
			n,
			len(ba.ByteArray),
		)
	}
	ba.ByteArray[n] = v
	return nil
}

func (ba *ByteArray) SetBytes(n int, vl []uint8) error {
	if (n + len(vl)) > len(ba.ByteArray) {
		return fmt.Errorf(
			"attempt to set %d bytes from %d (length %d)",
			len(vl),
			n,
			len(ba.ByteArray),
		)
	}
	for i := range vl {
		ba.ByteArray[n+i] = vl[i]
	}
	return nil
}

func (ba *ByteArray) PushByte(v uint8) {
	ba.ByteArray = append(ba.ByteArray, v)
}

func (ba *ByteArray) PushBytes(vl []uint8) {
	ba.ByteArray = append(ba.ByteArray, vl...)
}

func (ba *ByteArray) Trim() error {
	newBa := make([]uint8, len(ba.ByteArray))
	copy(newBa, ba.ByteArray)
	ba.ByteArray = newBa
	return nil
}

func (ba *ByteArray) PushNByte(v uint32) {
	if v < 128 {
		ba.PushByte(uint8(v + 128))
	} else {
		mod := v % 128
		ba.PushByte(uint8(mod))
		ba.PushNByte(v >> 7)
	}
}

func (ba *ByteArray) PushNBytes(vl []uint32) {
	for i := range vl {
		ba.PushNByte(vl[i])
	}
}

func (ba *ByteArray) NByte(n int) (uint32, error) {
	if n >= len(ba.ByteArray) {
		return 0, fmt.Errorf(
			"attempt to read byte %d for NByte(length %d)",
			n,
			len(ba.ByteArray),
		)
	}
	v, err := ba.Byte(n)
	if err != nil {
		return 0, err
	}
	if v > 127 {
		return uint32(v - 128), nil
	} else {
		v2, err := ba.NByte(n + 1)
		if err != nil {
			return 0, err
		} else {
			return uint32(v) + (v2 * 128), nil
		}
	}
}

func (ba *ByteArray) NBytes(n int, nValues int) ([]uint32, error) {
	var rValues []uint32
	for nValues > 0 {
		var cValue uint32 = 0
		var multiplier uint32 = 1
		for {
			if n >= len(ba.ByteArray) {
				return nil, fmt.Errorf(
					"attempt to read byte %d (length %d)",
					n,
					len(ba.ByteArray),
				)
			}
			v, err := ba.Byte(n)
			if err != nil {
				return nil, err
			}
			n++
			if v > 127 {
				cValue += uint32(v-128) * multiplier
				rValues = append(rValues, cValue)
				break
			} else {
				cValue += uint32(v) * multiplier
				multiplier *= 128
			}
		}
		nValues--
	}
	return rValues, nil
}

func (ba *ByteArray) PushCountedString(s string) {
	sA := []byte(s)
	ba.PushByte(uint8(len(sA)))
	ba.PushBytes(sA)
}

func (ba *ByteArray) CountedString(n int) (string, error) {
	sLength, err := ba.Byte(n)
	if err != nil {
		return "", err
	}
	sA, err := ba.Bytes(n+1, int(sLength))
	if err != nil {
		return "", err
	}
	return string(sA), nil
}

func (ba *ByteArray) CountedStrings() ([]string, error) {
	var strs []string
	var sLength uint8 = 0
	var err error
	for n := 0; (n + int(sLength)) < len(ba.ByteArray); n += int(sLength) + 1 {
		sLength, err = ba.Byte(n)
		if err != nil {
			return nil, err
		}
		sA, err := ba.Bytes(n+1, int(sLength))
		if err != nil {
			return nil, err
		}
		strs = append(strs, string(sA))
	}
	return strs, nil
}

func (ba *ByteArray) Clear() {
	ba.ByteArray = nil
}

func (ba *ByteArray) NByteLength(v int) int {
	ret := 1
	for v > 127 {
		v = v >> 7
		ret++
	}
	return ret
}

func (ba *ByteArray) base64() string {
	return b64.StdEncoding.EncodeToString(ba.ByteArray)
}

func (ba *ByteArray) UnmarshalJSON(b []byte) error {
	var base64Str string
	err := json.Unmarshal(b, &base64Str)
	if err != nil {
		return err
	}
	*ba, err = NewByteArrayFromBase64(base64Str)
	if err != nil {
		return err
	}
	err = ba.Trim()
	return err
}

func (ba ByteArray) MarshalJSON() ([]byte, error) {
	return json.Marshal(ba.ByteArray[:])
}

func (ba *ByteArray) DeleteItem(n int) error {
	sLength, err := ba.Byte(n)
	if err != nil {
		return err
	}
	itemLength := int(sLength & 0x0000003F)
	if len(ba.ByteArray) > n {
		remainingBytes := make([]uint8, len(ba.ByteArray)-(n+itemLength))
		copy(remainingBytes, ba.ByteArray[n+itemLength:])
		err = ba.SetBytes(n, remainingBytes)
		if err != nil {
			return err
		}
		ba.ByteArray = ba.ByteArray[:len(ba.ByteArray)-n]
	}
	return nil
}

func (ba *ByteArray) Insert(n int, iba ByteArray) {
	newLength := len(ba.ByteArray) + len(iba.ByteArray)
	if newLength <= cap(ba.ByteArray) {
		ba2 := ba.ByteArray[:newLength]
		copy(ba2[n+len(iba.ByteArray):], ba.ByteArray[n:])
		copy(ba2[n:], iba.ByteArray)
		ba.ByteArray = ba2
		return
	}
	ba2 := make([]uint8, len(ba.ByteArray)+len(iba.ByteArray))
	copy(ba2, ba.ByteArray[:n])
	copy(ba2[n:], iba.ByteArray)
	copy(ba2[n+len(iba.ByteArray):], ba.ByteArray[n:])
	ba.ByteArray = ba2
}

func (ba *ByteArray) EnumStringIndex(s string) (int, error) {
	pos, count := 0, 0
	for pos < len(ba.ByteArray) {
		strLen, err := ba.Byte(pos)
		if err != nil {
			return -1, err
		}
		enumStr, err := ba.CountedString(pos)
		if err != nil {
			return -1, err
		}
		if enumStr == s {
			return count, nil
		}
		pos += int(strLen + 1)
		count++
	}
	return -1, nil
}
