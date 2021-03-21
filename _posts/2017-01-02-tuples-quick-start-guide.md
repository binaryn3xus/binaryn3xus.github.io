---
title: Tuples - Quick Start Guide
date: '2017-01-02T01:40:02-0500'
categories:
- C#
tags:
- Tuple
- C# 7.0
- NuGet
- Microsoft
---

What's a Tuple? How do they work? In this post we will explore just what a Tuple is, the basics, and what new features we will see in Tuples for C# 7.0. They are interesting and could be helpful in your code.

<!--more-->

The Basics - What is a Tuple?
-----------------------------

Microsoft defines a Tuple in its class definition as:

> _A tuple is a data structure that has a specific number and sequence of elements. An example of a tuple is a data structure with three elements (known as a 3-tuple or triple) that is used to store an identifier such as a person's name in the first element, a year in the second element, and the person's income for that year in the third element. The .NET Framework directly supports tuples with one to seven elements._  
> _Source: [https://msdn.microsoft.com/en-us/library/system.tuple(v=vs.110).aspx](https://msdn.microsoft.com/en-us/library/system.tuple(v=vs.110).aspx)_

So at this point you may still be scratching your head. At least I was. The easiest way to think of a Tuple is to look at it as on-the-fly quick class option.

This is probably better explained in an example. So lets say that we have some data that we want to display to a user such as profile data.

{% highlight csharp %}
// create a user tuple.
var user = new Tuple("Joshua Garrison", 26, "555-555-5555");

// Generate a simple output.
Console.WriteLine($"{user.Item1} is {user.Item2} years old with a phone number of {user.Item3}");
{% endhighlight %}

As you can see in the example, we created a Tuple for 'user' that has two string objects and one integer. We then set the values in the parenthesis. **Note:**  The order of the values IS important in regards to the order you defined the Tuple's data set. In other words, if you define things as string, double, float then your values should follow that same order when you define them.

When should I use it?
---------------------

This really depends on what you are doing. Sometimes it can be tempting to just create a simple object array but lets face it, that is lazy, code smell, and could quickly get confusing when you start debugging. In my opinion, tuples should probably be used sparingly. In most instances, I believe that a custom Class would probably be a better option. However, Microsoft says that tuples are commonly used in the four following ways:

1.  To represent a single set of data. For example, a tuple can represent a database record, and its components can represent individual fields of the record.
2.  To provide easy access to, and manipulation of, a data set.
3.  To return multiple values from a method without using out parameters (in C#) or ByRef parameters (in Visual Basic).
4.  To pass multiple values to a method through a single parameter. For example, the Thread.Start(Object) method has a single parameter that lets you supply one value to the method that the thread executes at startup time. If you supply a Tuple object as the method argument, you can supply the thread’s startup routine with three items of data.
   
    _Source: [https://msdn.microsoft.com/en-us/library/system.tuple(v=vs.110).aspx](https://msdn.microsoft.com/en-us/library/system.tuple(v=vs.110).aspx)_

Tips
----

1) It is possible to have more than 8 items in the tuple. You just have to embed another Tuple. Technically you can keep embedding them but that would get messy really quick. Here is an example of how you could use more than 8. Below is an example based on Microsoft's prime number example.

{% highlight csharp %}
//More than 8 objects
var primes = new Tuple(2, 3, 5, 7, 11, 13, 17, new Tuple(19, 23, 29));

//Grab tenth item
Console.WriteLine(primes.Rest.Item3);
{% endhighlight %}

2) You can use the 'Create' helper method which supports being able to create a Tuple with one to eight objects. It does not suppose the ability to create nine or more objects in a tuple. You will have to do that part on your own. Here is Microsoft' example:

{% highlight csharp %}
var primes = Tuple.Create(2, 3, 5, 7, 11, 13, 17, 19);
Console.WriteLine("Prime numbers less than 20: " + 
                  "{0}, {1}, {2}, {3}, {4}, {5}, {6}, and {7}",
                  primes.Item1, primes.Item2, primes.Item3, 
                  primes.Item4, primes.Item5, primes.Item6,
                  primes.Item7, primes.Rest.Item1);
{% endhighlight %}

3) Tuples are not zero based. So when you go to get you items, you will _not_ be using 'Item0' first, you would be using 'Item1'. Which to me feels odd since most programming things start at zero. However, after a bit of research on this, it appears as though it is this way because of historical reasons.

4) Tuples are immutable. In other words, once they are set, you cannot change the value of any of the objects inside. You would need to recreate another Tuple.

Whats new in C# 7.0?
--------------------

In C# 7.0, Microsoft is introducing **tuple types** and **tuple literals**.

As you can see from the examples above, using a tuple can be very verbose. With the new features coming in 7.0, you will be able to cut down on the clutter. So lets revisit our example above with getting information about a user. In the example below, we will create a method that will return a _tuple value_ of the information that we want to return. Tuple values are slightly different because they don't have to be explicitly defined. Instead C# determines the type of value that you are using in your parentheses.

{% highlight csharp %}
(string, int, string) LookupUser(int userId) // tuple return type
{
    //Get data from SQL or other data source
    return (name, age, phone); // tuple literal
}
{% endhighlight %}

So as you can see, we are basically grabbing some information from our database and then returning a tuple. Once you have the tuple back, you can simply access the data by doing something like _TupleVariableName.Item3_ for the phone number.

But...we can do better right?

How about we get a little more descriptive about what the heck we are returning so that debugging later is maybe slightly easier and less confusing. Item1, Item2, etc are all the default names for tuple elements but did you know that you can change these values for each tuple? Probably not, or else why would you be reading this, right? All you have to do is change the return type, here is an example based on the previous example:

{% highlight csharp %}
(string name, int age, string phone) LookupUser(int userId) //return type
{% endhighlight %}

Or, you would simply use tuple literals:

{% highlight csharp %}
return (name: name, age: age, phone: phone); // tuple literal
{% endhighlight %}

As a result, you can then simple call something like:

{% highlight csharp %}
var userData = LookupUser(id);
Console.WriteLine($"{userData.name} is {userdata.age} years old.");
{% endhighlight %}

Much cleaner to read and understand in my opinion instead of seeing generic names like Item1 and Item2 littered throughout your code.

Final Thoughts
--------------

At the time of writing this, Tuples are not quite releases. Even in the preview 4 for Visual Studio "15". So the way you can get them to work right now is to go into NuGet and get the package for "System.ValueTuple". Install that and you should be able to start using the improvements to Tuples.

Hopefully this guide was helpful on getting you started if you did not understand what a Tuple was before.

So what are your thoughts on Tuples? Are they helpful or just an avenue for messy code? Let me know in the comments below!