package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/mvahowe/proskomma-go/versification"
)

// this runs the versification methods 20 times and prints the averages as a means to compare
// against golang running in webassembly.

func main() {
	var iterations int64 = 20
	jsonFile, err := os.Open("../../test_data/vul.vrs")
	if err != nil {
		fmt.Println("Error opening vul.vrs", err)
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)
	var fVrsTimeTotal int64 = 0
	var fSvmTimeTotal int64 = 0
	var fMappingTimeTotal int64 = 0
	var rVrsTimeTotal int64 = 0
	var rSvmTimeTotal int64 = 0
	var rMappingTimeTotal int64 = 0
	for i := 1; i < int(iterations); i++ {
		fVrsTime, fSvmTime, fMappingTime, rVrsTime, rSvmTime, rMappingTime := RunVersification(s)
		fVrsTimeTotal += fVrsTime
		fSvmTimeTotal += fSvmTime
		fMappingTimeTotal += fMappingTime
		rVrsTimeTotal += rVrsTime
		rSvmTimeTotal += rSvmTime
		rMappingTimeTotal += rMappingTime
	}
	fmt.Println("Averages over", iterations, "runs...")
	fmt.Println("golang ForwardVersification:", fVrsTimeTotal/iterations)
	fmt.Println("golang SuccinctifyVerseMappings (forward):", fSvmTimeTotal/iterations)
	fmt.Println("golang MapVerse (forward):", fMappingTimeTotal/iterations)
	fmt.Println("golang ReverseVersification:", rVrsTimeTotal/iterations)
	fmt.Println("golang SuccinctifyVerseMappings (reverse):", rSvmTimeTotal/iterations)
	fmt.Println("golang MapVerse (reverse):", rMappingTimeTotal/iterations)
}

func RunVersification(vrs string) (fVrsTime int64, fSvmTime int64, fMappingTime int64, rVrsTime int64, rSvmTime int64, rMappingTime int64) {
	start := time.Now()
	fVrs := versification.ForwardVersification(vrs)
	fVrsTime = time.Since(start).Milliseconds()

	start = time.Now()
	fSvm, _ := versification.SuccinctifyVerseMappings(fVrs.Mappings)
	fSvmTime = time.Since(start).Milliseconds()

	start = time.Now()
	versification.MapVerse(fSvm.Mappings["GEN"]["31"], "GEN", 31, 55)
	fMappingTime = time.Since(start).Milliseconds()

	start = time.Now()
	rVrs := versification.ReverseVersification(fVrs)
	rVrsTime = time.Since(start).Milliseconds()

	start = time.Now()
	rSvm, _ := versification.SuccinctifyVerseMappings(rVrs.Mappings)
	rSvmTime = time.Since(start).Milliseconds()

	start = time.Now()
	versification.MapVerse(rSvm.Mappings["GEN"]["32"], "GEN", 32, 1)
	rMappingTime = time.Since(start).Milliseconds()

	return fVrsTime, fSvmTime, fMappingTime, rVrsTime, rSvmTime, rMappingTime
}
