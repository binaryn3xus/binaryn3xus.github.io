---
title: Running a VSTS Agents Behind Your Corporate Firewall
date: 2018-04-30T17:21:31-04:00
categories:
- VSTS
tags:
- VSTS
---
I seem to find all the ways to get hung up by the company proxy that my company runs. Anything from node.js, git, or even nuget sometimes. As a result, it is now a habit for me to start looking into how to setup any proxy settings every time that I am starting to set up something new. The latest new project at work is a Visual Studio Team Services (VSTS) Agent for on-premise deployment.

<!--more-->

### Why use a VSTS Agent on-premise?

Okay, so it may seem a little weird to be using a cloud service but at the same time then relying on an on-premise server as well for deployment. Let me explain. At work, we are using VSTS because, our location does not have the resources to manage a Team Foundation Server and a SQL database for upgrades or when issues arise. So it only seems logical to let Microsoft handle the upgrades and maintenance for us in terms of source control. Now, the problem with this is how our firewalls work. We can make outbound requests but not necessarily just push things into our network at will. We cannot even use secure FTP. By using a VSTS Agent on one of our local servers, we can pull in the artifacts from VSTS and then just deploy locally on the network. Enough talk...lets get started!

### Download Files and Extract Files

There are two ways to download the requires files to get started:

1.  From inside of VSTS, go the the admin settings inside your project. Then click on `Agent Queues`. You will see a download agent button near the top of this page.
2.  Download it from Github: [https://github.com/Microsoft/vsts-agent](https://github.com/Microsoft/vsts-agent)

After you have downloaded these files, extract them to a folder where you want the files to permanently live. For me, that was `C:\agent` (Only because it was recommended by Microsoft).

### Setup and First Run

Assuming that you are on windows, you will need to open a powershell window inside this new folder you have extracted these files to. This folder should have the `config.cmd` or `config.sh` in it. Here is the command that you will use to start the process. You will need to use your own vsts instance name and PAT token.

{% highlight powershell %}
.\\config.cmd --url https://{your-vsts-name}.visualstudio.com --auth pat --token {YOUR-PAT-TOKEN-HERE} \`
--proxyurl {YOUR-PROXY-URL}:{YOUR-PROXY-PORT} --proxyusername "YOUR-USERNAME" --proxypassword "YOUR-PASSWORD" \`
--agent $env:COMPUTERNAME --runAsService --windowsLogonAccount "NT AUTHORITY\\SYSTEM"
{% endhighlight %}

Lets do a quick break down of what is happening here:

*   Url: This is the URL of your VSTS instance.
*   Auth: This is telling the agent what kind of authentication method you want to use. PAT in our case.
*   Token: This is our PAT token that we get from VSTS. If you need help with getting this, please see the [Authenticate access with personal access tokens for VSTS and TFS](https://docs.microsoft.com/en-us/vsts/accounts/use-personal-access-tokens-to-authenticate?view=vsts) document.
*   ProxyUrl: The URL of your local proxy including the port number as well.
*   ProxyUsername: The username of the proxy user
*   ProxyPassword: The password for the proxy user
*   runAsServer: This tells the agent to run as a service every time you reboot the machine.
*   windowsLoginAccount: This is the account that you want to run the service as.

### Conclusion

If you have done everything correctly, the machine should show up in your agent queues. As you can see, it is not difficult to set up this agent locally on your corporate network behind a firewall. Fortunately, our proxy does not require authentication so I didn't have to set all of that up. I also recommend using the help option available in the config command. It has several flags available that will improve your experience with setting up and taking down the agent.

Additional Resource: [https://docs.microsoft.com/en-us/vsts/build-release/actions/agents/proxy?view=vsts](https://docs.microsoft.com/en-us/vsts/build-release/actions/agents/proxy?view=vsts)