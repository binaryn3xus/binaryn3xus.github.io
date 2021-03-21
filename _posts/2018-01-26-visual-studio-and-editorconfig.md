---
title: Visual Studio and .EditorConfig
date: 2018-01-26T11:07:32-05:00
categories:
- General
- Visual Studio
tags:
- Visual Studio
- C#
- EditorConfig
---
## Introduction

![VS-EditorConfig](http://dotnetevolved.com/wp-content/uploads/2018/01/VS-EditorConfig-300x188.png)

Do you work on a team that cannot seem to follow a coding style? Or do you sometimes find yourself not following your own preferred coding style? If you fall into one of these categories or just want to force yourself to follow a standard (set by yourself or a team), then I recommend that you add a EditorConfig file to your project. It sits right on the root of your project next to your 'readme.md' or your '.gitignore'.

<!--more-->

Now you are probably thinking to yourself, why would I want this? I could just simply keep my code clean because I am the only one writing it. Well, I can promise you that you have missed at least one thing in your code where you broke your own rules. So with that said, just create yourself a .editorconfig one time and use it on all your projects to make sure your code matches all around. As a matter of fact, I will provide you my default editorconfig to get you started if you are feeling lazy (see below)!

## Okay, I'm sold...what next?

Good, glad you made it this far. It probably means that you care about clean code. Gold star for you! Now, if you were like me, you didn't know where to start. What does it look like? Where do I go from here?

Slow down! So first, lets make a '.editorconfig' in the root of your solutions folder at the same place that you would put your .gitignore or readme.md. Done? Okay cool. Lets continue.

This next part is optional but I recommend it because I love intellisense. If you are using Visual Studio and have not heard of a gentleman named [Mads Kristensen](https://madskristensen.net/) then I suggest that you look him up and all the nice Visual Studio extensions that he has built. They will blow your mind! He has developed the [EditorConfig Language Service](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.EditorConfig) and it is awesome! It is open source (Obligatory GitHub Link: [https://github.com/madskristensen/EditorConfigLanguage](https://github.com/madskristensen/EditorConfigLanguage))! This plugin will give you intellisense and will underline potential issues with your EditorConfig file. Not to mention, Mads is super nice and helpful. I submitted a bug to him on Github, then in one hour he had confirmed the bug and fixed it!

Okay now, you may start to ask yourself "How do I get started?" "Where can I figure out the rules to set?". Don't worry, I have you covered. I can only speak for Visual Studio but there is a nice well written Microsoft article for the different rules and how to create your own rules: [.NET Coding Convention Settings For EditorConfig](https://docs.microsoft.com/en-us/visualstudio/ide/editorconfig-code-style-settings-reference).

## Sample EditorConfig

As promised, here is my sample config file. This is valid as of posting of this article in January of 2018. This file has mostly default settings but there are a few minor tweaks that I prefer.

{% highlight ini %}
# editorconfig.org

# top-most EditorConfig file
root = true

# Default settings:
# A newline ending every file
# Use 4 spaces as indentation
[*]
insert_final_newline = true
indent_style = space
indent_size = 4

# C# files
[*.cs]

# "This." and "Me." Qualification
dotnet_style_qualification_for_field = false:suggestion
dotnet_style_qualification_for_property = false:suggestion
dotnet_style_qualification_for_method = false:suggestion
dotnet_style_qualification_for_event = false:suggestion

# Language keywords (int, string, etc.) vs framework type names for type references
dotnet_style_predefined_type_for_locals_parameters_members = true:suggestion
dotnet_style_predefined_type_for_member_access = true:suggestion
dotnet_style_object_initializer = true:suggestion
dotnet_style_collection_initializer = true:suggestion
dotnet_style_explicit_tuple_names = true:warning
dotnet_style_coalesce_expression = true:suggestion
dotnet_style_null_propagation true:warning

# "var" and Explicit Types
csharp_style_var_for_built_in_types true:suggestion
csharp_style_var_when_type_is_apparent = true:suggestion
csharp_style_var_elsewhere = true:suggestion

# Expression-bodied Members
csharp_style_expression_bodied_methods = false:none
csharp_style_expression_bodied_constructors = false:none
csharp_style_expression_bodied_operators = false:none
csharp_style_expression_bodied_properties = true:none
csharp_style_expression_bodied_indexers = true:none
csharp_style_expression_bodied_accessors = true:none

# Pattern matching
csharp_style_pattern_matching_over_is_with_cast_check = true:suggestion
csharp_style_pattern_matching_over_as_with_null_check = true:suggestion
csharp_style_inlined_variable_declaration = true:suggestion

# Expression-level Preferences
csharp_prefer_simple_default_expression = true:suggestion

# "Null" Checking Preferences
csharp_style_throw_expression = true:suggestion
csharp_style_conditional_delegate_call = true:suggestion

# Code Block Preferences
csharp_prefer_braces = false:suggestion

# Organize Usings
dotnet_sort_system_directives_first = true

# Newline Options
csharp_new_line_before_open_brace = all
csharp_new_line_before_else = true
csharp_new_line_before_catch = true
csharp_new_line_before_finally = true
csharp_new_line_before_members_in_object_initializers = true
csharp_new_line_before_members_in_anonymous_types = true
csharp_new_line_between_query_expression_clauses = true

# Indentation Options
csharp_indent_case_contents = true
csharp_indent_switch_labels = true
csharp_indent_labels = no_change

# Spacing Options
csharp_space_after_cast = true
csharp_space_between_method_declaration_parameter_list_parentheses = false
csharp_space_between_method_call_parameter_list_parentheses = false
csharp_space_between_parentheses = false

# Wrapping Options
csharp_preserve_single_line_statements = false
csharp_preserve_single_line_blocks = true

#####
# Naming Convention (Custom)
#####

## Name all constant fields using PascalCase
dotnet_naming_rule.constant_fields_should_be_pascal_case.severity = error
dotnet_naming_rule.constant_fields_should_be_pascal_case.symbols  = constant_fields
dotnet_naming_rule.constant_fields_should_be_pascal_case.style    = pascal_case_style
dotnet_naming_symbols.constant_fields.applicable_kinds   = field
dotnet_naming_symbols.constant_fields.required_modifiers = const
dotnet_naming_style.pascal_case_style.capitalization = pascal_case

## Name all private fields with camelCase
dotnet_naming_symbols.private_field_symbol.applicable_kinds = field
dotnet_naming_symbols.private_field_symbol.applicable_accessibilities = private
dotnet_naming_style.private_field_style.capitalization = camel_case
dotnet_naming_rule.private_fields_are_camel_case.severity = error
dotnet_naming_rule.private_fields_are_camel_case.symbols = private_field_symbol
dotnet_naming_rule.private_fields_are_camel_case.style = private_field_style

## Name all non-private fields with PascalCase
dotnet_naming_symbols.non_private_field_symbol.applicable_kinds = field
dotnet_naming_symbols.non_private_field_symbol.applicable_accessibilities = public,internal,friend,protected,protected_internal,protected_friend
dotnet_naming_style.non_private_field_style.capitalization = pascal_case
dotnet_naming_rule.non_private_fields_are_pascal_case.severity = error
dotnet_naming_rule.non_private_fields_are_pascal_case.symbols = non_private_field_symbol
dotnet_naming_rule.non_private_fields_are_pascal_case.style = non_private_field_style

## Names of parameters must be CamelCase
dotnet_naming_symbols.parameter_symbol.applicable_kinds = parameter
dotnet_naming_style.parameter_style.capitalization = camel_case
dotnet_naming_rule.parameters_are_camel_case.severity = error
dotnet_naming_rule.parameters_are_camel_case.symbols = parameter_symbol
dotnet_naming_rule.parameters_are_camel_case.style = parameter_style

## Non-interface types must use PascalCase
dotnet_naming_symbols.non_interface_type_symbol.applicable_kinds = class,struct,enum,delegate
dotnet_naming_style.non_interface_type_style.capitalization = pascal_case
dotnet_naming_rule.non_interface_types_are_pascal_case.severity = error
dotnet_naming_rule.non_interface_types_are_pascal_case.symbols = non_interface_type_symbol
dotnet_naming_rule.non_interface_types_are_pascal_case.style = non_interface_type_style

## Interfaces must use PascalCase and start with a prefix of 'I'
dotnet_naming_symbols.interface_type_symbol.applicable_kinds = interface
dotnet_naming_style.interface_type_style.capitalization = pascal_case
dotnet_naming_style.interface_type_style.required_prefix = I
dotnet_naming_rule.interface_types_must_be_prefixed_with_I.severity = error
dotnet_naming_rule.interface_types_must_be_prefixed_with_I.symbols = interface_type_symbol
dotnet_naming_rule.interface_types_must_be_prefixed_with_I.style = interface_type_style

## Methods, Properties, and Events must use PascalCase
dotnet_naming_symbols.member_symbol.applicable_kinds = method,property,event
dotnet_naming_style.member_style.capitalization = pascal_case
dotnet_naming_rule.members_are_pascal_case.severity = error
dotnet_naming_rule.members_are_pascal_case.symbols = member_symbol
dotnet_naming_rule.members_are_pascal_case.style = member_style

# Xml project files
[*.{csproj,vcxproj,vcxproj.filters,proj,nativeproj,locproj}]
indent_size = 2
{% endhighlight %}

## Conclusion

If you are on a team that has a hard time with keeping the code clean and following some code styles, then this might be a good solution for you. For me, it is mostly just to make sure that I keep myself honest and have clean code. I highly recommend you at least try it. If you are not happy then you can always go to some other style management system. I just like this because it helps you as you are coding in Visual Studio.