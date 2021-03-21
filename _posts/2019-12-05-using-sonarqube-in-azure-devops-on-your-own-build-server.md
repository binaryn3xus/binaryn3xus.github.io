---
title: Using SonarQube in Azure DevOps on Your Own Build Server
date: '2019-12-05T11:41:53-0500'
categories:
- C#
- ".NET Core"
- Git
tags:
- C#
- Security
- Git
---
Let's face it, we are not all perfect programmers. I know...I know...that's a hard pill to swallow. However, luckily, we can get a little hand-holding from our friends over at SonarQube to help us figure out where we made our mistakes or where our vulnerabilities are. I will let you research how to use SonarQube properly after you get your report. In this tutorial, we will look at how to use your own build server, Azure DevOps and the SonarQube Scanner to scan your code in your build process.

<!--more-->

## Preparing Your Build Server

Preparing the build server was probably the most "difficult" part of this process for me. It's actually not a hard process now that I have struggled through some of the gotchas for you. So the project that I am putting through this process is written in .NET Core 2 but the process should work fine for .NET Core 3. I am also choosing to do this on an internal build server because our instance of SonarQube is not accessible from an Azure DevOps Hosted Agent. We also have a lot of proxy rules in our enterprise environment that makes things difficult sometimes, so this was the path of least resistance and produced successful results.

First, let me list out the issues that I experienced and then we will go over what I did to fix them.

**Issues Experienced**

* Projects in my solution didn't have ProjectGuids in them.
* Java_home variable was not setup
* SSL Certificate Issue
* Installing the global tool vs tool path

### Projects Must-Have ProjectGuid Defined

This one tripped me up because I didn't initially see anything about needing a ProjectGuid in my projects. So when I got the error in my logs, I quickly googled how to add one to my projects. It's actually very easy.

**Note:** There is an open issue that talks about how this should not be required after SonarQube 7.6. So you might want to read on this before continuing in this section. Here is a direct link to a comment that has a work-around: [https://github.com/SonarSource/sonar-scanner-msbuild/issues/659#issuecomment-493294626](https://github.com/SonarSource/sonar-scanner-msbuild/issues/659#issuecomment-493294626)
{: .notice--info}

Basically you just need to go into your .csproj file for your project and add your ProjectGuid inside of a PropertyGroup section. You can create your own GUID since it is not really linked to anything in particular. However, if you prefer uniformity, like me, open your .sln file in a text editor and get the unique GUID for your project in there to use. 

For example:
{% highlight plaintext %}
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "SMI.Core", "SMI.Core\SMI.Core.csproj", "{51FA09DA-9131-4D49-AE85-CF5C45F83C39}"
EndProject
{% endhighlight %}

In the code block above, that second GUID that starts with "{51FA...}" is your unique project code. The first one is the GUID for the solution if I am not mistaken.

And just for an example, here is a snippet of a PropertyGroup in my project:

{% highlight xml %}
<PropertyGroup>
  <TargetFramework>netstandard2.0</TargetFramework>
  <ProjectGuid>{51FA10DA-9343-4D99-AE76-CF5C45F83D49}</ProjectGuid>
  <LangVersion>latest</LangVersion>
  <AppendTargetFrameworkToOutputPath>False</AppendTargetFrameworkToOutputPath>
</PropertyGroup>
{% endhighlight %}

### Properly Defining JAVA_HOME Variable

I almost didn't add this section to the article because most people who have worked with Java in the past have experienced this issue before. However, this is primarily a .NET site so lets quickly cover it.

Oracle used to have their Java installation split into two downloads a JRE (Java Runtime Environment) and JDK (Java Development Kit). However, now they are combined into one JDK. So download the latest (or appropriate version for your SQ instance) and install it.

Then in your Environmental Variables for your build server, you are going to want to add one named "JAVA_HOME" and give it the path to your JDK installation folder. For me, it was "C:\Program Files\Java\jdk-11.0.5". While you are adding Environmental Variables, you might want to peek at the 'Creating you Azure DevOps YAML' section below since we are going to be adding two more.

### SSL Certificate Issues

I am not going to go into a whole lot of details on this part. However, if you are getting this error below, you will need to complete this step as well.

{% highlight xml %}
ERROR: SonarQube server [THE-PATH-OF-YOUR-INSTANCE] can not be reached
Caused by: javax.net.ssl.SSLHandshakeException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
{% endhighlight %}

So this error is much longer when you see it with the stack-trace but I am cutting out parts of it to save you time. When I first got this, I missed the part about the certification and spent too much time thinking it was the proxy. Nope.

Anyway, I can't explain how to fix this any better than an article from Atlassian on how to import the SSL that you need into your server's 'JVM truststore'. See here: [https://confluence.atlassian.com/kb/how-to-import-a-public-ssl-certificate-into-a-jvm-867025849.html](https://confluence.atlassian.com/kb/how-to-import-a-public-ssl-certificate-into-a-jvm-867025849.html)

### SonarQube Global Tool vs Per-Build Tool

This is going to come down to a preference thing for each team. However, I believe in taking as many "prerequisites" off the build server as possible. That is why I am going to recommend that you use the tool path option. The rest of this article assumes that you are taking this path as well. However, here are your two options: 

#### Installation of the SonarScanner for MSBuild .NET Core Tool to a tool path (My Recommended Way)

{% highlight powershell %}
dotnet tool install dotnet-sonarscanner --tool-path YOURTOOLPATHHERE
{% endhighlight %}

#### Installation of the SonarScanner for MSBuild .NET Core Global Tool

{% highlight powershell %}
dotnet tool install --global dotnet-sonarscanner --version 4.7.1
{% endhighlight %}

The __--version__ argument is optional. If it is omitted the latest version will be installed.

* * *

## Creating your Azure DevOps YAML
Now, let's get started into the fun stuff. With the new change to using YAML instead of the classic way of building Azure Pipelines, it makes it much easier to just share some code to get your pipeline started.

### YAML Code

This is my full YAML Script. As a result, you might get a little extra bonus content here. The only things that are redacted or scrambled are the name/key of my sonar project and a vstsFeed for an unrelated Task.

{% highlight yaml %}
name: $(date:yyyyMMdd)$(rev:.r)

variables:
  buildConfiguration: 'Release'
  sonarToolPath: $(build.sourcesdirectory)\Tool.SonarScanner
  sonarToolExe: $(build.sourcesdirectory)\Tool.SonarScanner\dotnet-sonarscanner.exe

stages:
  - stage: Build_and_Release
    jobs:
      - job:
        pool:
          name: "MTH"
          demands:
            - npm
            - node.js
            - SonarQube
        displayName: 'Build / Scan / Publish'
        steps:

        - task: DotNetCoreCLI@2
          displayName: Install SonarScanner Tool
          inputs:
            command: 'custom'
            custom: 'tool'
            arguments: 'install dotnet-sonarscanner --tool-path $(sonarToolPath)'

        - task: Npm@1
          displayName: 'NPM Install'
          inputs:
            command: 'install'
            workingDir: '$(build.sourcesdirectory)\SMI.MVC'

        - task: Gulp@1
          displayName: 'Gulp All'
          inputs:
            gulpFile: 'SMI.MVC/gulpfile.js'
            targets: 'All'
            enableCodeCoverage: false

        - task: PowerShell@2
          displayName: Begin SonarQube Scanner for SMI
          inputs:
            targetType: 'inline'
            script: '$(sonarToolExe) begin /k:"12345-My-Project-Name" /d:sonar.verbose=true /d:sonar.host.url=$env:SonarHostUrl /d:sonar.login=$env:SonarLogin'
            
        - task: DotNetCoreCLI@2
          displayName: 'Restore'
          inputs:
            command: 'restore'
            projects: '**/*.csproj'
            feedsToUse: 'select'
            vstsFeed: '345cf5e-7de5-4769-9fa8-22f908f18260'

        - task: DotNetCoreCLI@2
          displayName: 'Build'
          inputs:
            command: 'build'
            projects: '**/*.csproj'
            arguments: '--configuration $(BuildConfiguration)'

        - task: PowerShell@2
          displayName: End SonarQube Scanner for SMI
          inputs:
            targetType: 'inline'
            script: '$(sonarToolExe) end /d:sonar.login=$env:SonarLogin'

        - task: DotNetCoreCLI@2
          displayName: 'Publish '
          inputs:
            command: 'publish'
            publishWebProjects: false
            projects: '**/*.csproj'
            arguments: '--configuration $(BuildConfiguration) --output $(build.artifactstagingdirectory)'

        - task: PublishBuildArtifacts@1
          displayName: 'Publish Artifact'
          inputs:
            PathtoPublish: '$(build.artifactstagingdirectory)'

{% endhighlight %}

### Notes on the code above

Some things you will need to know about the code above. You need to define the following Environment Variables on your build server or in your YAML. I chose to do it on my build server for now but that might change in the future.

Environment Variables (on the build server):

*   SonarHostUrl=https://yoursonarservername
*   SonarLogin=yoursonarsecuritytoken

Also, the order **does** matter here in terms of your task. So be sure you do it in this general order:

*   Install tool (if not using --global)
*   Run your SonarQube 'begin' command
*   Do your MSBuild process
*   Run your SonarQube 'end' command

### Conclusion

SonarQube is a great tool to help you remain a good developer and stay on top of your vulnerabilities in your code base. This guide covered how to do it on your own build server. However, if you have a public SonarQube instance, it is much easier to accomplish using the Tasks in Azure DevOps built by the SonarQube team. If you have any questions/concerns, please let me know.

### Resources:

*   [https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-msbuild/](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-msbuild/)