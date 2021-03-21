---
title: StringBuilder and Performance
date: 2017-02-13T21:04:52-05:00
categories:
- C#
tags:
- StringBuilder
- Performance
---

You hear about how StringBuilder is better than regular concatenations. Why? And is it really better?

<!--more-->

If you have been in the development world very long then at some point you have probably had someone tell you that you should not use concatenation too often because you will take a hit to performance. Maybe you just took that advice and moved on without researching it. If so, we will cover it in this post.

A string is an <a href="http://dotnetevolved.com/2017/01/mutable-vs-immutable/" target="_blank">immutable object</a>. When you concatenate a string or when you are "modifying" a string, you are actually creating a new string object on the memory heap. Not only that, but now you are working in a completely different memory address. So imagine doing this in your code. Yikes!

Oh? Dont believe me? Take a look at the following sample code.

{% highlight csharp %}
class Program
    {
        static void Main(string[] args)
        {
            var begin = DateTime.Now;
            concat();
            Console.WriteLine("Concat Elapsed " + (DateTime.Now - begin).TotalMilliseconds + " ms");

            begin = DateTime.Now;
            builder();
            Console.WriteLine("StringBuilder elapsed " + (DateTime.Now - begin).TotalMilliseconds + " ms");
            Console.ReadKey();
        }

        private static void builder()
        {
            StringBuilder s = new StringBuilder();
            for (int i = 0; i < 100000; i++)
                s.Append("*");
        }

        private static void concat()
        {
            String s = "";
            for (int i = 0; i < 100000; i++)
                s += "*";
        }
    }
{% endhighlight %}

So now lets look at the results...
{% highlight plaintext %}
> Concat Elapsed 2745.1779 ms
> StringBuilder elapsed 1.9972 ms
{% endhighlight %}

Relatively, that is a HUGE difference. This is because you are not having to create a new object and you are not allocating new space on the heap when you use StringBuilder. So your next question will likely be, when should I use a StringBuilder over concatenation? If you need to append more than three or four times, I would recommend that you use a StringBuilder instead on using concatenation.

Hopefully this will give you an idea of why you would want to use StringBuilder instead of just always running with concatenation.

Thanks for reading and happy coding!
