package main

import (
	"fmt"
	"syscall/js"

	succ "github.com/mvahowe/proskomma-go/succinct"
	vrs "github.com/mvahowe/proskomma-go/versification"
	vert "github.com/norunners/vert"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("vrs2json", js.FuncOf(forwardVersification))
	js.Global().Set("reverseVersification", js.FuncOf(reverseVersification))
	js.Global().Set("succinctifyVerseMappings", js.FuncOf(succinctifyVerseMappings))
	js.Global().Set("mapVerse", js.FuncOf(mapVerse))
	<-c
}

func forwardVersification(this js.Value, args []js.Value) interface{} {
	inputString := args[0].String()
	f := vrs.ForwardVersification(inputString)
	return vert.ValueOf(f)
}

func reverseVersification(this js.Value, args []js.Value) interface{} {
	v := vert.ValueOf(args[0])
	forwardMappings := &vrs.ForwardMappings{}
	v.AssignTo(forwardMappings)

	f := vrs.ReverseVersification(*forwardMappings)
	return vert.ValueOf(f)
}

func succinctifyVerseMappings(this js.Value, args []js.Value) interface{} {
	v := vert.ValueOf(args[0])
	mappings := &vrs.VrsMappings{}
	v.AssignTo(mappings)

	svm, err := vrs.SuccinctifyVerseMappings(*mappings)

	if err != nil {
		errStr := fmt.Sprintf("error calling SuccinctifyVerseMappings: %s", err)
		result := map[string]interface{}{
			"error": errStr,
		}
		return result
	}

	return vert.ValueOf(svm.Mappings)
}

func mapVerse(this js.Value, args []js.Value) interface{} {
	v := vert.ValueOf(args[0])
	ba := &succ.ByteArray{}
	v.AssignTo(ba)
	book := args[1].String()
	chapter := args[2].Int()
	verse := args[3].Int()

	result, err := vrs.MapVerse(*ba, book, chapter, verse)
	if err != nil {
		errStr := fmt.Sprintf("error calling MapVerse: %s", err)
		result := map[string]interface{}{
			"error": errStr,
		}
		return result
	}

	verseMappings := make([][]int, len(result.VerseMappings))
	for i := range result.VerseMappings {
		verseMappings[i] = make([]int, 2)
		verseMappings[i][0] = result.VerseMappings[i].Chapter
		verseMappings[i][1] = result.VerseMappings[i].Verse
	}
	arr := []interface{}{result.BookCode, verseMappings}
	return vert.ValueOf(arr)
}
