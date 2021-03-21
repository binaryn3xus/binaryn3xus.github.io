---
title: Chromium Embedded Framework - Capture Secure Cookies
date: 2017-04-05T14:37:23-04:00
categories:
- C#
tags:
- CefSharp
- Chromium
- C#
- SQLite
---

If you've ever googled [CefSharp](https://github.com/cefsharp/CefSharp), or any kind of Chromium Embedded Framework library, about wanting to catch all the cookies (including secure cookies) from a browser session, you will likely be met with a lot of resistance or the sound of crickets. In this post, we will cover how exactly you can get those using some tool.  

<!--more-->

I was recently working on a side project with [Danny Allegrezza](http://dannyallegrezza.com/) and we were trying to figure out how to capture all the cookies from a website including the secure cookies. The goal was to be able to replay our own HTTP requests to the server so that we could pull back the JSON data that is returns for later use. This project was using WinForms and CefSharp component to browser the webpages.

After several attempts to pass the HTTP requests with all the information that we thought that we needed, we kept getting '400' or '404' error codes. We then turned to the internet in hopes to find the answer on a blog or in the CefSharp documentation. After about 30-45 minutes of us searching for an answer, we began to question where CefSharp was storing the cookies on the local machine. It didn't take long to find the 'Cookies' file in the application debug directory (_OurApplicationDirectory\\bin\\x86\\Debug\\cachedata\\Cookies_). If you try to open this file with a text editor like Notepad++, you will likely see just a bunch of encoded text lines. However, there was one line that popped out immediately in the beginning of the file. The line of text read "SQLite format 3". This gave me the idea to try to open it with a SQLite browser. Using [DB Browser for SQLite](http://sqlitebrowser.org/), I was able to open the file and see all the cookies that the browser had collected. This included both secure and non-secure cookies. Below is a screenshot of the DB Browser for SQLite showing my local cookies (I have put a blur effect on potentially sensitive information).

[![](http://dotnetevolved.com/wp-content/uploads/2017/04/DBBrowserSQLiteSecureCookie.png)](http://dotnetevolved.com/wp-content/uploads/2017/04/DBBrowserSQLiteSecureCookie.png) Screenshot of DB Browser for SQL highlighting secure cookies

Armed with this new found knowledge, I created a new class and a few methods for going directly to the cookie file using the SQLite C# libraries. Afterwards, we were able to get the required cookies for the HTTP request, add them to the cookie container, and sent the request. This time we got a '200' response code along with the expected JSON response data. Success!

Here is some example code for how we were able to read this data (please note this is quick code, probably not the best production code):

{% highlight csharp %}
public void RefreshFromCache()
{
    var cacheLocation = Environment.CurrentDirectory + @"\\cachedata\\Cookies";
    CachedCookies = new List();
    using (var database = new SQLiteConnection($"Data Source={cacheLocation};Version=3;"))
    {
        using (var command = new SQLiteCommand("SELECT \* FROM cookies WHERE host\_key = '.example.com'", database))
        {
            try
            {
                database.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var cookie = new Cookie()
                    {
                        Name = reader.GetString(reader.GetOrdinal("name")),
                        Value = reader.GetString(reader.GetOrdinal("value")),
                        Domain = reader.GetString(reader.GetOrdinal("host\_key")),
                        Secure = reader.GetBoolean(reader.GetOrdinal("secure")),
                        HttpOnly = reader.GetBoolean(reader.GetOrdinal("httponly")),
                        Path = reader.GetString(reader.GetOrdinal("path"))
                    };
                    CachedCookies.Add(cookie);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}
{% endhighlight %}

As you can see, it is very simple to get the cookies based on just building out your SQLite connection and running a simple query. We actually found this so easy that we replaced another method that was using a more official way to get the cookies.

Keep in mind that this is more of a workaround rather than an official method. This could potentially break at anytime if this cookie file is handled any differently by Chromium in the future.

If you found this helpful for you and thanks for reading!