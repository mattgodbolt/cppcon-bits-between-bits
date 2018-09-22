#include <iostream>

struct Foo {
  static int numFoos;
  Foo() { 
    numFoos++; 
  }
  ~Foo() { 
    numFoos--;
  }
};
int Foo::numFoos;

Foo globalFoo;

int main() {
  std::cout << "numFoos = " << Foo::numFoos << "\n";
}
