//     alog.js 0.1.0

//     (c) 2013-2014 Venkatraman, UI Architect
//     For all details and documentation:
//     https://github.com/ramsunvtech/access-log

// Initial Setup
// -------------
var access = {};

// Current version of the library. Keep in sync with `package.json`.
access.VERSION = '0.1.0';

// Warning Message Style.
access.warnMsgStyle = 'color:red;font-size:120%;font-weight:bold;line-height:15px;';

// Error Count Property.
access.errorCount = 0;

// Attribute Property.
access.attribute = 'alt';

// Main H1 Style.
access.H1Style = "font-family:trebuchet ms;color:red;font-size:160%;text-decoration:underline;font-weight:bold;line-height:50px;";

// Main H2 Style.
access.H2Style = "font-family:trebuchet ms;color:red;font-size:135%;font-weight:bold;line-height:50px;";

// Main H3 Style.
access.H3Style = "font-family:trebuchet ms;color:red;font-size:100%;font-weight:bold;line-height:10px;";

// Message Object Property.
access.message = {
  "blank": function (attribute, tag) {
    return tag + ": " + attribute + " attribute is blank";
  },
  "missing": function (attribute, tag) {
    return tag + ": Missing attribute (" + attribute + ")";
  },
  "notUnique": function (tag, length) {
    return tag + " used " + length + " times";
  },
  "inValidField": function (tag, fieldId) {
    return tag + " pointed to non-exist Element (#" + fieldId + ")";
  },
  "inValidFormField": function (tag, fieldId) {
    return tag + " pointed to invalid Form Field (#" + fieldId + ")";
  }
}

// Missing Accessbility.
access.missing = function () {
  access.getElByMissedAttribute('img', 'alt');
  access.getElByMissedAttribute('table', 'scope');
  access.getElByMissedAttribute('a', 'title');
  access.getElByMissedAttribute('label', 'for');
  access.inValidEl('label', 'for');
  access.hasMany('h1');
}

// Format the Warn.
access.warn = function (msg) {
  console.warn('%c' + msg, access.warnMsgStyle);
}

access.aLog = function (warningMsg, code) {
  access.warn(warningMsg);
  console.log(code);
  console.log(' ');
}

// Check If Element used Many times in Page.
access.hasMany = function (tag) {
  var elStack = document.getElementsByTagName(tag),
      isElDefined = (elStack !== undefined) ? true : false,
      hasMany = (isElDefined) ? (elStack.length > 1) ? true : false : false;

  if(hasMany) {
    console.groupCollapsed('%c' + tag + ': Element Usage', access.H3Style);
    access.aLog(access.message.notUnique(tag, elStack.length), elStack);
    console.groupEnd();
  }
}

// Check If Given Tag has given attribute is exist.
access.getElByMissedAttribute = function (tag, attribute) {
  var elStack = document.getElementsByTagName(tag),
      groupFlag = false;

  // Iterating each Element.
  for(index in elStack) {
    var isElDefined = elStack[index].tagName !== undefined;

    // Check If its Tag.
    if(isElDefined) {
      var attributevalue = elStack[index].getAttribute(attribute),
          isAttributeBlank = (attributevalue == '') ? true : false,
          isAttributeMissed = (attributevalue == '' || attributevalue == null || attributevalue === undefined) ? true : false;

      if(groupFlag == false && (isAttributeBlank || isAttributeMissed)) {
        groupFlag = true;
        console.groupCollapsed('%c' + tag + ': Missing Attributes (' + attribute + ')', access.H3Style);
      }

      // Check If Given Attribute is Exist and Blank.
      if(isAttributeBlank) {
        access.errorCount++;
        access.aLog(access.message.blank(attribute, tag), elStack[index]);
      }
      // Check If Given Attribute is Missed.
      else if(isAttributeMissed) {
        access.errorCount++;
        access.aLog(access.message.missing(attribute, tag), elStack[index]);
      }
    }
  }

  if(groupFlag == true) console.groupEnd();
}

// Check If Given Field Id is Exist and not valid
access.inValidEl = function (tag, attribute) {
  var elStack = document.getElementsByTagName(tag),
      groupFlag = false;

  // Iterating each Element.
  for(index in elStack) {
    var isElDefined = elStack[index].tagName !== undefined,
        elHasAttribute = (typeof elStack[index].hasAttribute === 'function') ? elStack[index].hasAttribute(attribute) : false;

    // Check If its Tag is Defined and Has Attribute.
    if(isElDefined && elHasAttribute) {
      var attributevalue = elStack[index].getAttribute(attribute),
          labelHasValue = (tag == 'label' && attributevalue != '') ? true : false;

      // Check if `Label` for is Exist and Valid Form Field.
      if(labelHasValue) {
        var formField = document.getElementById(attributevalue),
            inValidEl = (formField == '' || formField == null) ? true : false,
            fieldType = (inValidEl) ? 'none' : formField.tagName.toLowerCase(),
            inValidFormField = (fieldType == 'input' || fieldType == 'textarea' || fieldType == 'select' || fieldType == 'datalist') ? false : true;

        if(groupFlag == false && (inValidEl || inValidFormField)) {
          groupFlag = true;
          console.groupCollapsed('%c' + tag + ': Attribute (' + attribute + ') Pointing to Non-exist Element / Invalid Field Id', access.H3Style);
        }

        if(inValidEl) {
          access.aLog(access.message.inValidField(tag, attributevalue), elStack[index]);
        }
        else if(inValidFormField) {
          access.aLog(access.message.inValidFormField(tag, attributevalue), elStack[index]);
        }
      }

    }
  }

  if(groupFlag == true) console.groupEnd();
}

// Initialize Method.
access.initialize = function () {
  console.time("Time Taken");
  console.clear();
  console.log("%cAccessbility Log", access.H1Style);
  access.missing();
  console.log("%cTotal Errors: " + access.errorCount, access.H2Style);
  console.timeEnd("Time Taken");
}();
