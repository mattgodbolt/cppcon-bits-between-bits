CC:=/opt/compiler-explorer/gcc-8.1.0/bin/gcc
CXX:=/opt/compiler-explorer/gcc-8.1.0/bin/g++
CFLAGS=-Os -g
CXXFLAGS=-Os -g

default: all 
define ADD_C =
out/$(2)/$(1)_c.o: $(1)_c.c Makefile
	@mkdir -p $$(dir $$@)
	$(CC) -c -o $$@ $$< $(CFLAGS) $(3)
out/$(2)/$(1)_c: out/$(2)/$(1)_c.o Makefile
	@mkdir -p $$(dir $$@)
	$(CC) -o $$@ $$< $(CFLAGS) $(3)
ALL_TARGETS += out/$(2)/$(1)_c
endef

define ADD_CXX =
out/$(2)/$(1)_cpp.o: $(1)_cpp.cpp Makefile
	@mkdir -p $(dir $$@)
	$(CXX) -c -o $$@ $$< $(CXXFLAGS) $(3)
out/$(2)/$(1)_cpp: out/$(2)/$(1)_cpp.o Makefile
	@mkdir -p $(dir $$@)
	$(CXX) -o $$@ $$< $(CXXFLAGS) $(3)
ALL_TARGETS += out/$(2)/$(1)_cpp
endef

define ADD =
$(call ADD_C,$(1),$(2)/static,-static $(3))
$(call ADD_CXX,$(1),$(2)/static,-static $(3))
$(call ADD_C,$(1),$(2)/dynamic,$(3))
$(call ADD_CXX,$(1),$(2)/dynamic,$(3))
endef

$(eval $(call ADD,hello,none,))
$(eval $(call ADD,hello,lto,-flto))
$(eval $(call ADD,hello,sections,-ffunction-sections -fdata-sections))
$(eval $(call ADD,hello,sections,-ffunction-sections -fdata-sections))

all: $(ALL_TARGETS)

.PHONY: clean all

clean:
	rm -rf out/
