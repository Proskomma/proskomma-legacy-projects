package versification

import (
	"io/ioutil"
	"os"
	"strconv"
	"testing"
)

func TestForwardVersification(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	f := ForwardVersification(s)

	if len(f.Mappings.MappedVerses) == 0 {
		t.Errorf("No vrs mappings were returned")
	}

	if v, present := f.Mappings.MappedVerses["PSA 51:0"]; present {
		if len(v) != 2 {
			t.Errorf("Expected PSA 51:0 to have 2 mapped verses, but found %d", len(v))
		}
	} else {
		t.Errorf("PSA 51:0 mapping not found")
	}
}

func TestReverseVersification(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	f := ForwardVersification(s)
	r := ReverseVersification(f)

	if len(r.Mappings.MappedVerses) == 0 {
		t.Errorf("No reverse mappings were returned")
	}

	for _, mv := range f.Mappings.MappedVerses {
		if _, present := r.Mappings.MappedVerses[mv[0]]; !present {
			t.Errorf("Expected mapped verse %s to be a key in reverse mappings, but not found.", mv[0])
		}
	}
}

func TestPreSuccinctVerseMapping(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	f := ForwardVersification(s)

	p, err := preSuccinctVerseMapping(f.Mappings)
	if err != nil {
		t.Errorf("preSuccinctVerseMapping failed %s", err)
	}

	preSuccinctBooks := []string{"GEN", "LEV", "PSA", "ACT", "S3Y"}
	if len(preSuccinctBooks) != len(p.BookMappings) {
		t.Errorf("Expected preSuccinct mappings to have %d books, but found %d", len(preSuccinctBooks), len(p.BookMappings))
	}

	for _, b := range preSuccinctBooks {
		if _, present := p.BookMappings[b]; !present {
			t.Errorf("Expected book %s to be a key in preSuccinct mappings but not found.", b)
		}
	}

	if _, present := p.BookMappings["GEN"]["31"]; !present {
		t.Error("Expected book/chapter mapping GEN 31 to be present, but it was not.")
	}
	if _, present := p.BookMappings["GEN"]["32"]; !present {
		t.Error("Expected book/chapter mapping GEN 32 to be present, but it was not.")
	}

	if vm, present := p.BookMappings["S3Y"]["1"]; present {
		if vm[0].Mappings[0].Book != "DAG" {
			t.Errorf("Expected to find mapping to book DAG, but found %s", vm[0].Mappings[0].Book)
		}
	} else {
		t.Error("Expected book/chapter mapping S3Y 1 to be present, but it was not.")
	}

	r := ReverseVersification(f)

	if len(r.Mappings.MappedVerses) == 0 {
		t.Errorf("No reverse mappings were returned")
	}
	pr, err := preSuccinctVerseMapping(r.Mappings)
	if err != nil {
		t.Errorf("preSuccinctVerseMapping failed on reverse mappings %s", err)
	}

	preSuccinctBooks = []string{"GEN", "LEV", "PSA", "ACT", "DAG"}
	if len(preSuccinctBooks) != len(pr.BookMappings) {
		t.Errorf("Expected preSuccinct reverse mappings to have %d books, but found %d", len(preSuccinctBooks), len(pr.BookMappings))
	}

	for _, b := range preSuccinctBooks {
		if _, present := pr.BookMappings[b]; !present {
			t.Errorf("Expected book %s to be a key in preSuccinct reverse mappings but not found.", b)
		}
	}

	if _, present := pr.BookMappings["LEV"]["5"]; !present {
		t.Error("Expected book/chapter mapping LEV 5 to be present, but it was not.")
	}
	if _, present := pr.BookMappings["LEV"]["6"]; !present {
		t.Error("Expected book/chapter mapping LEV 6 to be present, but it was not.")
	}

	if vm, present := pr.BookMappings["DAG"]["3"]; present {
		if vm[0].Mappings[0].Book != "S3Y" {
			t.Errorf("Expected to find mapping to book S3Y, but found %s", vm[0].Mappings[0].Book)
		}
	} else {
		t.Error("Expected book/chapter mapping DAG 3 to be present, but it was not.")
	}
}

func TestSuccinctifyVerseMappings(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	f := ForwardVersification(s)

	c, err := SuccinctifyVerseMappings(f.Mappings)
	if err != nil {
		t.Errorf("SuccinctifyVerseMappings failed %s", err)
	}

	succinctBooks := []string{"GEN", "LEV", "PSA", "ACT", "S3Y"}
	if len(succinctBooks) != len(c.Mappings) {
		t.Errorf("Expected succinct mappings to have %d books, but found %d", len(succinctBooks), len(c.Mappings))
	}

	for _, b := range succinctBooks {
		if _, present := c.Mappings[b]; !present {
			t.Errorf("Expected book %s to be a key in succinct mappings but not found.", b)
		}
	}

	if _, present := c.Mappings["GEN"]["31"]; !present {
		t.Error("Expected book/chapter mapping GEN 31 to be present, but it was not.")
	}
	if _, present := c.Mappings["GEN"]["32"]; !present {
		t.Error("Expected book/chapter mapping GEN 32 to be present, but it was not.")
	}

	r := ReverseVersification(f)
	rs, err := SuccinctifyVerseMappings(r.Mappings)

	succinctBooks = []string{"GEN", "LEV", "PSA", "ACT", "DAG"}
	if len(succinctBooks) != len(rs.Mappings) {
		t.Errorf("Expected reverse succinct mappings to have %d books, but found %d", len(succinctBooks), len(rs.Mappings))
	}

	for _, b := range succinctBooks {
		if _, present := rs.Mappings[b]; !present {
			t.Errorf("Expected book %s to be a key in reverse succinct mappings but not found.", b)
		}
	}

	if _, present := rs.Mappings["LEV"]["5"]; !present {
		t.Error("Expected book/chapter mapping LEV 31 to be present, but it was not.")
	}
	if _, present := rs.Mappings["LEV"]["6"]; !present {
		t.Error("Expected book/chapter mapping LEV 32 to be present, but it was not.")
	}
}

func TestUnsuccinctifyVerseMappingForward(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	f := ForwardVersification(s)

	c, err := SuccinctifyVerseMappings(f.Mappings)
	if err != nil {
		t.Errorf("SuccinctifyVerseMappings failed %s", err)
	}

	unsuccinctS3Y, err := unsuccinctifyVerseMapping(c.Mappings["S3Y"]["1"], "S3Y")
	if err != nil {
		t.Errorf("unsuccinctifyVerseMapping failed for S3Y 1 %s", err)
	}
	if unsuccinctS3Y[0].FromVerseStart != 1 {
		t.Errorf("Expected unsuccinctify from verse start for S3Y 1 to be 1 but was %d", unsuccinctS3Y[0].FromVerseStart)
	}
	if unsuccinctS3Y[0].FromVerseEnd != 29 {
		t.Errorf("Expected unsuccinctify from verse end for S3Y 1 to be 29 but was %d", unsuccinctS3Y[0].FromVerseEnd)
	}
	if unsuccinctS3Y[0].BookCode != "DAG" {
		t.Errorf("Expected unsuccinctify book code for S3Y 1 to be DAG but was %s", unsuccinctS3Y[0].BookCode)
	}
	if unsuccinctS3Y[0].Mappings[0].Ch != 3 {
		t.Errorf("Expected unsuccinctify S3Y 1 first mapping Ch to be 3 but was %d", unsuccinctS3Y[0].Mappings[0].Ch)
	}
	if unsuccinctS3Y[0].Mappings[0].VerseStart != 24 {
		t.Errorf("Expected unsuccinctify S3Y 1 first mapping verse start to be 24 but was %d", unsuccinctS3Y[0].Mappings[0].VerseStart)
	}

	unsuccinctACT, err := unsuccinctifyVerseMapping(c.Mappings["ACT"]["19"], "ACT")
	if err != nil {
		t.Errorf("unsuccinctifyVerseMapping failed for ACT 19 %s", err)
	}
	if unsuccinctACT[0].FromVerseStart != 40 {
		t.Errorf("Expected unsuccinctify from verse start for ACT 19[0] to be 40 but was %d", unsuccinctACT[0].FromVerseStart)
	}
	if unsuccinctACT[0].FromVerseEnd != 40 {
		t.Errorf("Expected unsuccinctify from verse end for ACT 19[0] to be 40 but was %d", unsuccinctACT[0].FromVerseEnd)
	}
	if unsuccinctACT[0].BookCode != "ACT" {
		t.Errorf("Expected unsuccinctify book code for ACT 19[0] to be ACT but was %s", unsuccinctACT[0].BookCode)
	}
	if unsuccinctACT[0].Mappings[0].Ch != 19 {
		t.Errorf("Expected unsuccinctify ACT 19[0] first mapping Ch to be 19 but was %d", unsuccinctACT[0].Mappings[0].Ch)
	}
	if unsuccinctACT[0].Mappings[0].VerseStart != 40 {
		t.Errorf("Expected unsuccinctify ACT 19[0] first mapping verse start to be 40 but was %d", unsuccinctACT[0].Mappings[0].VerseStart)
	}
	if unsuccinctACT[1].FromVerseStart != 41 {
		t.Errorf("Expected unsuccinctify from verse start for ACT 19[1] to be 41 but was %d", unsuccinctACT[1].FromVerseStart)
	}
	if unsuccinctACT[1].FromVerseEnd != 41 {
		t.Errorf("Expected unsuccinctify from verse end for ACT 19[1] to be 41 but was %d", unsuccinctACT[1].FromVerseEnd)
	}
	if unsuccinctACT[1].BookCode != "ACT" {
		t.Errorf("Expected unsuccinctify book code for ACT 19[1] to be ACT but was %s", unsuccinctACT[1].BookCode)
	}
	if unsuccinctACT[1].Mappings[0].Ch != 19 {
		t.Errorf("Expected unsuccinctify ACT 19[1] first mapping Ch to be 19 but was %d", unsuccinctACT[1].Mappings[0].Ch)
	}
	if unsuccinctACT[1].Mappings[0].VerseStart != 40 {
		t.Errorf("Expected unsuccinctify ACT 19[1] first mapping verse start to be 40 but was %d", unsuccinctACT[1].Mappings[0].VerseStart)
	}
}

func TestUnsuccinctifyVerseMappingReverse(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	f := ForwardVersification(s)
	r := ReverseVersification(f)

	c, err := SuccinctifyVerseMappings(r.Mappings)
	if err != nil {
		t.Errorf("SuccinctifyVerseMappings failed %s", err)
	}

	unsuccinctDAG, err := unsuccinctifyVerseMapping(c.Mappings["DAG"]["3"], "DAG")
	if err != nil {
		t.Errorf("unsuccinctifyVerseMapping failed for DAG 3 %s", err)
	}
	if unsuccinctDAG[0].FromVerseStart != 24 {
		t.Errorf("Expected unsuccinctify from verse start for DAG 3 to be 24 but was %d", unsuccinctDAG[0].FromVerseStart)
	}
	if unsuccinctDAG[0].FromVerseEnd != 52 {
		t.Errorf("Expected unsuccinctify from verse end for DAG 3 to be 52 but was %d", unsuccinctDAG[0].FromVerseEnd)
	}
	if unsuccinctDAG[0].BookCode != "S3Y" {
		t.Errorf("Expected unsuccinctify book code for DAG 3 to be S3Y but was %s", unsuccinctDAG[0].BookCode)
	}
	if unsuccinctDAG[0].Mappings[0].Ch != 1 {
		t.Errorf("Expected unsuccinctify DAG 3 first mapping Ch to be 1 but was %d", unsuccinctDAG[0].Mappings[0].Ch)
	}
	if unsuccinctDAG[0].Mappings[0].VerseStart != 1 {
		t.Errorf("Expected unsuccinctify DAG 3 first mapping verse start to be 1 but was %d", unsuccinctDAG[0].Mappings[0].VerseStart)
	}

	unsuccinctACT, err := unsuccinctifyVerseMapping(c.Mappings["ACT"]["19"], "ACT")
	if err != nil {
		t.Errorf("unsuccinctifyVerseMapping failed for ACT 19 %s", err)
	}
	if unsuccinctACT[0].FromVerseStart != 40 {
		t.Errorf("Expected unsuccinctify from verse start for ACT 19[0] to be 40 but was %d", unsuccinctACT[0].FromVerseStart)
	}
	if unsuccinctACT[0].FromVerseEnd != 40 {
		t.Errorf("Expected unsuccinctify from verse end for ACT 19[0] to be 40 but was %d", unsuccinctACT[0].FromVerseEnd)
	}
	if unsuccinctACT[0].BookCode != "ACT" {
		t.Errorf("Expected unsuccinctify book code for ACT 19[0] to be ACT but was %s", unsuccinctACT[0].BookCode)
	}
	if unsuccinctACT[0].Mappings[0].Ch != 19 {
		t.Errorf("Expected unsuccinctify ACT 19[0] first mapping Ch to be 19 but was %d", unsuccinctACT[0].Mappings[0].Ch)
	}
	if unsuccinctACT[0].Mappings[0].VerseStart != 40 {
		t.Errorf("Expected unsuccinctify ACT 19[0] first mapping verse start to be 40 but was %d", unsuccinctACT[0].Mappings[0].VerseStart)
	}
	if unsuccinctACT[0].Mappings[1].Ch != 19 {
		t.Errorf("Expected unsuccinctify ACT 19[0] second mapping Ch to be 19 but was %d", unsuccinctACT[1].Mappings[0].Ch)
	}
	if unsuccinctACT[0].Mappings[1].VerseStart != 41 {
		t.Errorf("Expected unsuccinctify ACT 19[0] second mapping verse start to be 41 but was %d", unsuccinctACT[1].Mappings[0].VerseStart)
	}
}

func TestMapVerseForward(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	expectedMapVerseResults := [...]expectedMapVerseResult{
		{fromBook: "GEN", fromCh: 31, fromV: 1, toBook: "GEN", toCh: 31, toV: 1},
		{fromBook: "GEN", fromCh: 31, fromV: 55, toBook: "GEN", toCh: 32, toV: 1},
		{fromBook: "GEN", fromCh: 32, fromV: 17, toBook: "GEN", toCh: 32, toV: 18},
		{fromBook: "PSA", fromCh: 51, fromV: 0, toBook: "PSA", toCh: 51, toV: 1},
		{fromBook: "PSA", fromCh: 51, fromV: 1, toBook: "PSA", toCh: 51, toV: 3},
		{fromBook: "ACT", fromCh: 19, fromV: 40, toBook: "ACT", toCh: 19, toV: 40},
		{fromBook: "ACT", fromCh: 19, fromV: 41, toBook: "ACT", toCh: 19, toV: 40},
		{fromBook: "S3Y", fromCh: 1, fromV: 2, toBook: "DAG", toCh: 3, toV: 25},
	}

	f := ForwardVersification(s)

	svm, err := SuccinctifyVerseMappings(f.Mappings)
	if err != nil {
		t.Errorf("SuccinctifyVerseMappings failed %s", err)
	}

	for _, expected := range expectedMapVerseResults {
		s := svm.Mappings[expected.fromBook][strconv.Itoa(expected.fromCh)]
		mapping, err := MapVerse(s, expected.fromBook, expected.fromCh, expected.fromV)
		if err != nil {
			t.Errorf("MapVerse failed for book %s chapter %d, verse %d: %s", expected.fromBook, expected.fromCh, expected.fromV, err)
		}

		if mapping.BookCode != expected.toBook {
			t.Errorf("Expected MapVerse mapping book code to be %s but was %s", expected.toBook, mapping.BookCode)
		}
		if mapping.VerseMappings[0].Chapter != expected.toCh {
			t.Errorf("Expected MapVerse mapping first verse mapping to be chapter %d but was %d", expected.toCh, mapping.VerseMappings[0].Chapter)
		}
		if mapping.VerseMappings[0].Verse != expected.toV {
			t.Errorf("Expected MapVerse mapping first verse mapping to be verse %d but was %d", expected.toV, mapping.VerseMappings[0].Verse)
		}
	}
}

func TestMapVerseReverse(t *testing.T) {
	jsonFile, err := os.Open("../test_data/truncated_versification.vrs")
	if err != nil {
		t.Error("Unable to open json test data file")
	}
	defer jsonFile.Close()
	bytes, _ := ioutil.ReadAll(jsonFile)
	s := string(bytes)

	expectedMapVerseResults := [...]expectedMapVerseResult{
		{fromBook: "GEN", fromCh: 32, fromV: 99, toBook: "GEN", toCh: 32, toV: 99},
		{fromBook: "GEN", fromCh: 32, fromV: 1, toBook: "GEN", toCh: 31, toV: 55},
		{fromBook: "GEN", fromCh: 32, fromV: 18, toBook: "GEN", toCh: 32, toV: 17},
		{fromBook: "PSA", fromCh: 11, fromV: 1, toBook: "PSA", toCh: 10, toV: 2},
		{fromBook: "PSA", fromCh: 51, fromV: 1, toBook: "PSA", toCh: 51, toV: 0},
		{fromBook: "PSA", fromCh: 51, fromV: 2, toBook: "PSA", toCh: 51, toV: 0},
		{fromBook: "PSA", fromCh: 51, fromV: 3, toBook: "PSA", toCh: 51, toV: 1},
		{fromBook: "DAG", fromCh: 3, fromV: 25, toBook: "S3Y", toCh: 1, toV: 2},
	}

	f := ForwardVersification(s)
	r := ReverseVersification(f)

	svm, err := SuccinctifyVerseMappings(r.Mappings)
	if err != nil {
		t.Errorf("SuccinctifyVerseMappings failed %s", err)
	}

	for _, expected := range expectedMapVerseResults {
		s := svm.Mappings[expected.fromBook][strconv.Itoa(expected.fromCh)]
		mapping, err := MapVerse(s, expected.fromBook, expected.fromCh, expected.fromV)
		if err != nil {
			t.Errorf("MapVerse failed for book %s chapter %d, verse %d: %s", expected.fromBook, expected.fromCh, expected.fromV, err)
		}

		if mapping.BookCode != expected.toBook {
			t.Errorf("Expected MapVerse mapping book code to be %s but was %s", expected.toBook, mapping.BookCode)
		}
		if mapping.VerseMappings[0].Chapter != expected.toCh {
			t.Errorf("Expected MapVerse mapping first verse mapping to be chapter %d but was %d", expected.toCh, mapping.VerseMappings[0].Chapter)
		}
		if mapping.VerseMappings[0].Verse != expected.toV {
			t.Errorf("Expected MapVerse mapping first verse mapping to be verse %d but was %d", expected.toV, mapping.VerseMappings[0].Verse)
		}
	}

	succinct := svm.Mappings["ACT"][strconv.Itoa(19)]
	mapping, err := MapVerse(succinct, "ACT", 19, 40)
	if err != nil {
		t.Errorf("MapVerse failed for book %s chapter %d, verse %d: %s", "ACT", 19, 40, err)
	}

	if mapping.BookCode != "ACT" {
		t.Errorf("Expected MapVerse mapping book code to be ACT but was %s", mapping.BookCode)
	}
	if mapping.VerseMappings[0].Chapter != 19 {
		t.Errorf("Expected MapVerse mapping first verse mapping to be chapter 19 but was %d", mapping.VerseMappings[0].Chapter)
	}
	if mapping.VerseMappings[0].Verse != 40 {
		t.Errorf("Expected MapVerse mapping first verse mapping to be verse 40 but was %d", mapping.VerseMappings[0].Verse)
	}
	if mapping.VerseMappings[1].Chapter != 19 {
		t.Errorf("Expected MapVerse mapping second verse mapping to be chapter 19 but was %d", mapping.VerseMappings[1].Chapter)
	}
	if mapping.VerseMappings[1].Verse != 41 {
		t.Errorf("Expected MapVerse mapping second verse mapping to be verse 41 but was %d", mapping.VerseMappings[1].Verse)
	}
}

type expectedMapVerseResult struct {
	fromBook string
	fromCh   int
	fromV    int
	toBook   string
	toCh     int
	toV      int
}
