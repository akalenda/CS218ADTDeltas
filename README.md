# CS 218 Class Project: Algebraically typed delta encoding

See PDF for full explanation: https://github.com/akalenda/CS218ADTDeltas/blob/master/draft2.pdf

This was a project to test a hypothesis I had about how the algebraic data types I learned
about in CS 252 would be applicable in a cloud environment. Properly, the backend should be written
in Scala or Haskell, where algebraic data types are supported on a fundamental level, but
neither of these are available in Google AppEngine. But that didn't hinder what we really
wanted to know about (differences in network traffic).

The front-end is Javascript, in the web folder. 
The back-end is a pretty standard Google App Engine affair
using Java, found in the src folder. Specifically in the environment
of Intellij IDEA 15.0.1.
