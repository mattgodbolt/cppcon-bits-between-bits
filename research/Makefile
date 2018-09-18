CC:=/opt/compiler-explorer/gcc-8.1.0/bin/gcc
CXX:=/opt/compiler-explorer/gcc-8.1.0/bin/g++
CFLAGS=-Os -fPIC
CXXFLAGS=-Os -fPIC

# Gotta love make...
define NEWLINE =


endef

define ONE_C_O =
out/$(1)/c/$(2)/$(4).o: $(4).c Makefile
	@mkdir -p $$(dir $$@)
	$(CC) -c -o $$@ $$< $(CFLAGS) $(3)
endef

default: all 
define ADD_C =
$(foreach OBJ,$(1) $(4),$(call ONE_C_O,$(1),$(2),$(3),$(OBJ))$(NEWLINE))
out/$(1)/c/$(2)/$(1): $(foreach OBJ,$(1) $(4),out/$(1)/c/$(2)/$(OBJ).o) | Makefile
	@mkdir -p $$(dir $$@)
	$(CC) -o $$@ $$^ $(CFLAGS) $(3)
ALL_TARGETS += out/$(1)/c/$(2)/$(1)
endef

define ONE_CXX_O =
out/$(1)/c++/$(2)/$(4).o: $(4).cpp Makefile
	@mkdir -p $$(dir $$@)
	$(CXX) -c -o $$@ $$< $(CXXFLAGS) $(3)
endef

define ADD_CXX =
$(foreach OBJ,$(1) $(4),$(call ONE_CXX_O,$(1),$(2),$(3),$(OBJ))$(NEWLINE))
out/$(1)/c++/$(2)/$(1): $(foreach OBJ,$(1) $(4),out/$(1)/c++/$(2)/$(OBJ).o) | Makefile
	@mkdir -p $$(dir $$@)
	$(CXX) -o $$@ $$^ $(CXXFLAGS) $(3)
ALL_TARGETS += out/$(1)/c++/$(2)/$(1)
endef

ORIGIN=$$$$ORIGIN
define ADD_CXX_DSO =
out/$(1)/c++/$(2)-dso/lib$(1).so: $(foreach OBJ,$(4),out/$(1)/c++/$(2)/$(OBJ).o) | Makefile
	@mkdir -p $$(dir $$@)
	$(CXX) -shared -o $$@ $$^ $(CXXFLAGS) $(3)
out/$(1)/c++/$(2)-dso/$(1): out/$(1)/c++/$(2)/$(1).o | out/$(1)/c++/$(2)-dso/lib$(1).so Makefile
	@mkdir -p $$(dir $$@)
	$(CXX) -o $$@ $$^ $(CXXFLAGS) $(3) -Lout/$(1)/c++/$(2)-dso -lhello '-Wl,--rpath,$(ORIGIN)'
ALL_TARGETS += out/$(1)/c++/$(2)-dso/$(1)
endef

define ADD_BOTH =
$(call ADD_C,$(1),$(2)/static,-static $(3),$(4))
$(call ADD_C,$(1),$(2)/dynamic,$(3),$(4))
$(call ADD_CXX,$(1),$(2)/static,-static $(3),$(4))
$(call ADD_CXX,$(1),$(2)/dynamic,$(3),$(4))
ifneq ("$(4)","")
$(call ADD_CXX_DSO,$(1),$(2)/dynamic,$(3),$(4))
endif
endef

define ADD =
$(call ADD_CXX,$(1),$(2)/static,-static $(3),$(4))
$(call ADD_CXX,$(1),$(2)/dynamic,$(3),$(4))
endef

define FOR_ALL_FLAGS =
$$(eval $$(call $(1),$(2),none,,$(3)))
$$(eval $$(call $(1),$(2),lto,-flto,$(3)))
$$(eval $$(call $(1),$(2),sections,-ffunction-sections -fdata-sections,$(3)))
endef

$(eval $(call FOR_ALL_FLAGS,ADD_BOTH,empty))
CFLAGS=-O0 -fPIC -g
CXXFLAGS=-O0 -fPIC -g
$(eval $(call FOR_ALL_FLAGS,ADD_BOTH,hello,message))
$(eval $(call FOR_ALL_FLAGS,ADD,global))

all: $(ALL_TARGETS)

.PHONY: clean all

clean:
	rm -rf out/
