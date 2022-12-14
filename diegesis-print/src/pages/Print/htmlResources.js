const startHTMLTemplate = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8"/>
    <title>%titlePage%</title>
    <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
    <style>
        @page {
            size: 210mm 297mm;
            margin-top: 20mm;
            margin-left: 20mm;
            margin-bottom: 30mm;

            @footnote {
                float:bottom;
                border-top: black 1px solid;
                padding-top: 2mm;
                font-size: 8pt;
            }

            @bottom-center {
                content: counter(page);
            }

            @top-center {
                content: element(heading);
            }

            @top-right {
                content: none;
            }
        }

        @page :blank {
            @bottom-center {
                content: none;
            }

            @top-center {
                content: none;
            }

            @top-right {
                content: none;
            }

        }

        @page :right {
            margin-left: 30mm;
            margin-right: 20mm;
        }

        @page :left {
            margin-right: 30mm;
            margin-left: 20mm;
        }

        div.titlePage {
            text-align: center;
        }

        h1, h2, h3, h4 {
            page-break-after: avoid;
            margin-bottom: 2px;
        }

        #toc_ul li {
            list-style-type: none;
            overflow-x: hidden;
        }

        #toc_ul li a {
            text-decoration: none;
            color: #000;
            background-color: white;
            padding-right: 6px;
        }

        #toc_ul li a::after {
            content: target-counter(attr(href url), page, decimal);
            float: right;
        }

        #toc_ul li.leader::after {
            content: ".................................................................................................................................................";
            float: left;
            width: 0;
            padding-left: 5px;
            letter-spacing: 6px;
        }

        #toc_ul li.leader a::after {
            position: absolute;
            right: 0;
            background-color: white;
            padding-left: 6px;
        }

        .leader {
            font-size: 9pt;
        }

        p.runningHeader {
            position: running(heading);
            font-style: italic;
            font-size: 8pt;
        }

        p.chapN {
            position: running(chapN);
            font-style: italic;
            font-size: 8pt;
        }

        span.footnote {float: footnote; }

        div.titlePage {
            page-break-after: recto;
            text-align: center;
        }

        div.toc {page-break-after: recto}
        div.bibleBook {
            page-break-after: recto;
        }
        div.periph {
            page-break-after: recto;
        }
        div.bibleBookBody {
            columns: 2;
            column-gap: 2em;
            widows: 2;
        }

        div.periphBody {
            columns: 1;
            widows: 2;
        }

        .toc_periph {font-style: italic}
        .toc_level1, .toc_level2, .toc_level3 {margin-top: 5px}
        .toc_level1 {
            font-size: 14pt;
            font-weight: bold;
        }
        .toc_level2 {font-size: 12pt}
        .toc_level3 {font-size: 10pt}

        .d {font-style: italic}
        .mt, .mt2, .mt3, .imt, .imt2, .imt3 {margin-bottom: 1ex}
        .mt, .mt2, .mt3 {text-align: center}
        .mt, .imt {font-weight: bold}
        .ms, .ms2, .ms3 {font-size: 10pt;}
        .r {font-weight: normal; font-style: italic; margin-top: 0; font-size: smaller}
        .is, .s {}
        .is2, .s2 {}

        .ili, .ip, .m, .p, .q, .q2, .q3, .q4 {margin-bottom: 0.4em; margin-top: 0.4em; font-size: 10pt;}
        .ili, .ip, .m, .p { text-align: justify }
        .ili {padding-left: 1.5em; font-size: 10pt;}
        .io, .io2 {font-size: 10pt; font-family: sans-serif}
        .io2 {padding-left: 1.5em}
        .ip {font-family: sans-serif; font-size: 10pt;}
        .q, .q1, .pi {padding-left: 1.5em; font-size: 10pt;}
        .q2 {padding-left: 2.5em; font-size: 10pt;}
        .q3 {padding-left: 3.5em; font-size: 10pt;}
        .q4 {padding-left: 4.5em; font-size: 10pt;}

        .bd {font-weight: bold}
        .bk {font-style: italic}
        .dc {}
        .em {font-style: italic}
        .fk {font-style: italic; font-weight: bold}
        .fq {font-style: italic}
        .fqa {font-style: italic}
        .fr {font-weight: bold; font-size: 8pt}
        .ft {}
        .fv {}
        .it {font-style: italic}
        .k {font-weight: bold; font-style: italic}
        .nd {font-variant: small-caps}
        .ord {font-size: 7pt; vertical-align: top}
        .pn {}
        .qs {font-style: italic; float: right; padding-left: 1em}
        .sls {font-style: italic}
        .tl {font-style: italic}
        .wj {color: #600}
        .xt {font-weight: bold}

        .chapter {
            padding-%right%: 0.25em;
            float: %left%;
            vertical-align: top;
            margin-top:0;
            margin-bottom: 0;
            font-size: 24pt;
        }
        .verses {font-size: 7pt; font-weight: bold}
    </style>
</head>
<body>
<div  dir="%textDirection%">
`;
const endHTMLTemplate = `</div>
</body>
</html>
`;
const tocHTMLTemplate = '<div class="toc">\n' +
    '    <h1>%toc_books%</h1>\n' +
    '    <ul id="toc_ul">\n' +
    '        %contentLinks%\n' +
    '    </ul>\n' +
    '</div>';
const titleHTMLTemplate = `<div class="titlePage">
    <h1>%titlePage%</h1>
    <h3>%copyright%</h3>
</div>
`;

const pagedJSStyle = `@page {
            size: 210mm 297mm;
            margin-top: 20mm;
            margin-left: 20mm;
            margin-bottom: 30mm;

            @footnote {
                float:bottom;
                border-top: black 1px solid;
                padding-top: 2mm;
                font-size: 8pt;
            }

            @bottom-center {
                content: counter(page);
            }

            @top-center {
                content: element(heading);
            }

            @top-right {
                content: none;
            }
        }

        @page :blank {
            @bottom-center {
                content: none;
            }

            @top-center {
                content: none;
            }

            @top-right {
                content: none;
            }

        }

        @page :right {
            margin-left: 30mm;
            margin-right: 20mm;
        }

        @page :left {
            margin-right: 30mm;
            margin-left: 20mm;
        }

        div.titlePage {
            text-align: center;
        }

        h1, h2, h3, h4 {
            page-break-after: avoid;
            margin-bottom: 2px;
        }

        #toc_ul li {
            list-style-type: none;
            overflow-x: hidden;
        }

        #toc_ul li a {
            text-decoration: none;
            color: #000;
            background-color: white;
            padding-right: 6px;
        }

        #toc_ul li a::after {
            content: target-counter(attr(href url), page, decimal);
            float: right;
        }

        #toc_ul li.leader::after {
            content: ".................................................................................................................................................";
            float: left;
            width: 0;
            padding-left: 5px;
            letter-spacing: 6px;
        }

        #toc_ul li.leader a::after {
            position: absolute;
            right: 0;
            background-color: white;
            padding-left: 6px;
        }

        .leader {
            font-size: 9pt;
        }

        p.runningHeader {
            position: running(heading);
            font-style: italic;
            font-size: 8pt;
        }

        p.chapN {
            position: running(chapN);
            font-style: italic;
            font-size: 8pt;
        }

        span.footnote {float: footnote; }

        div.titlePage {
            page-break-after: recto;
            text-align: center;
        }

        div.toc {page-break-after: recto}
        div.bibleBook {
            page-break-after: recto;
        }
        div.periph {
            page-break-after: recto;
        }
        div.bibleBookBody {
            columns: 2;
            column-gap: 2em;
            widows: 2;
        }

        div.periphBody {
            columns: 1;
            widows: 2;
        }

        .toc_periph {font-style: italic}
        .toc_level1, .toc_level2, .toc_level3 {margin-top: 5px}
        .toc_level1 {
            font-size: 14pt;
            font-weight: bold;
        }
        .toc_level2 {font-size: 12pt}
        .toc_level3 {font-size: 10pt}

        .d {font-style: italic}
        .mt, .mt2, .mt3, .imt, .imt2, .imt3 {margin-bottom: 1ex}
        .mt, .mt2, .mt3 {text-align: center}
        .mt, .imt {font-weight: bold}
        .ms, .ms2, .ms3 {font-size: 10pt;}
        .r {font-weight: normal; font-style: italic; margin-top: 0; font-size: smaller}
        .is, .s {}
        .is2, .s2 {}

        .ili, .ip, .m, .p, .q, .q2, .q3, .q4 {margin-bottom: 0.4em; margin-top: 0.4em; font-size: 10pt;}
        .ili, .ip, .m, .p { text-align: justify }
        .ili {padding-left: 1.5em; font-size: 10pt;}
        .io, .io2 {font-size: 10pt; font-family: sans-serif}
        .io2 {padding-left: 1.5em}
        .ip {font-family: sans-serif; font-size: 10pt;}
        .q, .q1, .pi {padding-left: 1.5em; font-size: 10pt;}
        .q2 {padding-left: 2.5em; font-size: 10pt;}
        .q3 {padding-left: 3.5em; font-size: 10pt;}
        .q4 {padding-left: 4.5em; font-size: 10pt;}

        .bd {font-weight: bold}
        .bk {font-style: italic}
        .dc {}
        .em {font-style: italic}
        .fk {font-style: italic; font-weight: bold}
        .fq {font-style: italic}
        .fqa {font-style: italic}
        .fr {font-weight: bold; font-size: 8pt}
        .ft {}
        .fv {}
        .it {font-style: italic}
        .k {font-weight: bold; font-style: italic}
        .nd {font-variant: small-caps}
        .ord {font-size: 7pt; vertical-align: top}
        .pn {}
        .qs {font-style: italic; float: right; padding-left: 1em}
        .sls {font-style: italic}
        .tl {font-style: italic}
        .wj {color: #600}
        .xt {font-weight: bold}

        .chapter {
            padding-%right%: 0.25em;
            float: %left%;
            vertical-align: top;
            margin-top:0;
            margin-bottom: 0;
            font-size: 24pt;
        }
        .verses {font-size: 7pt; font-weight: bold}`;

export {startHTMLTemplate, endHTMLTemplate, tocHTMLTemplate, titleHTMLTemplate, pagedJSStyle}
