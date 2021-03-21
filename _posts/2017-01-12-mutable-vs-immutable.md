---
title: Mutable Vs Immutable
date: '2017-01-12T18:57:20-0500'
tags:
- Programming
---

You've likely heard these terms before, Mutable and Immutable, whether it was on a podcast, blog, or in some documentation. Some people don't quite understand that it actually means. Here, I will explain to you what it means and what it means to you.

<!--more-->

Mutable Vs Immutable Objects
============================

Immutable Objects
-----------------

So lets first start with a quick definition and then I will move on to explaining it in a little more detail.

**Immutable Object** - This is an object that once it has been initiated the state of the object cannot be changed.

An example of an immutable object in C# is a String object or a Tuple object. So once they are are initially set, they cannot be changed. Take a look at the following code snippet:

{% highlight csharp linenos %}
var user = new Tuple("Joshua Garrison", 26, "555-555-5555");
string blogName = "DotNetEvolved!";

user.Item2 = 27;
blogName\[13\] = '?';
{% endhighlight %}

In line 4, we are attempting to change Item2's value from '26' to '27'. Luckily Visual Studio is smart enough to give us the following error message:

> Property of indexer 'Tuple.Item2' cannot be assigned to -- it is read only
> 
> The property 'Tuple.Item2' has no setter

In line 5, we are attempting to change the exclamation point to a question mark in the 'blogName' string. Just like what we saw in the error message above, we will get a similar error message from Visual Studio. However, instead of mentioning the Tuple, it will say `string.this\[int\]`.

As a result, the only way to change an Immutable Object, such as a string variable, is give it a whole new value. You can use any method you want to do this, such as concatenation, but you just cant modify the exact same value at the same memory address.

Mutable Objects
---------------

You may have guessed it, mutable objects are objects that you can directly modify.

A good example of a mutable object is a 'String Builder' instance. Operations on a StringBuilder instance will modify the actual object. Instead of creating a new object in memory, it dynamically expands memory to allow you to change the string. Lets look at an example:

{% highlight csharp linenos %}
StringBuilder sb = new StringBuilder("Hello"); // String reads "Hello"
sb.Append(" Readers!");// String reads "Hello Readers!"
sb.Insert(5, " Awesome");// String reads "Hello Awesome Readers!"
Console.WriteLine(sb);
{% endhighlight %}

So we start with the string 'Hello' and eventually end up with 'Hello Awesome Readers!' (Yes, you!).

**Tip:** StringBuilder is better to use when you need to modify a string often. This is better in terms of performance than just reassigning a new value to a string variable. See my article on [StringBuilder Performance]({% post_url 2017-02-13-is-stringbuilder-actually-better %})

Final:
------

Hopefully this was a well detailed explanation between the two terms and you have a better understanding of them. Now next time your co-worker or some podcast hosts mention the term, you can honestly know what they are talking about and follow along with no problems.

Thanks for reading and happy coding!