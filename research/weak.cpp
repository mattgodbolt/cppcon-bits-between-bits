#include <iostream>

#include "message_str.h"

int main() {
  std::cout << "std::string :" << getMessageStr() << "\n";
  std::cout << "const char *:" << getMessage() << "\n";
}
