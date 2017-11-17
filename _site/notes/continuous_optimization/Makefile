TEX = main.tex
DVI = $(TEX:.tex=.dvi)
PDF = $(TEX:.tex=.pdf)
AUX = $(TEX:.tex=.aux)
PRN = $(wildcard *.prn)
EPS = $(PRN:.prn=.eps)

.PHONY: all clean watch

all: $(PDF)

watch:
	pxdvi -watchfile 5 $(DVI)

clean:
	rm $(PDF) $(DVI) $(AUX) $(EPS)

$(PDF): $(DVI)
	dvipdfmx $<

$(DVI): $(TEX) $(EPS) $(AUX)
	platex $<
	pbibtex $(AUX)
	platex $<

%.eps: %.prn
	epstool --copy -b $< $@
