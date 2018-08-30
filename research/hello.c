#include <stdio.h>
#include "message.h"

void greet() {
	printf("%s\n", getMessage());
}

int main() {
	greet();
}
