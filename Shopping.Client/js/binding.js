//*************************************************************************
//
//    Copyright (c) 2013 Tallan Inc.  All rights reserved. 
//
//    Use of this sample source code is subject to the terms of the Microsoft Limited Public License
//    at http://msdn.microsoft.com/en-us/cc300389.aspx#P and is provided AS-IS. 
//
//    For more information about Tallan, visit our website, http://tallan.com/.     
//
//    To see the topic that inspired this sample app, go to http://msdn.microsoft.com/en-us/library/windows/apps/jj635241. 
//
//*************************************************************************


(function (WinJS, global) {
    "use strict";
    var disabledClassName = "mvvm-disabled";
    
    function isInt(value) {
        if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
            return true;
        } else {
            return false;
        }
    }
    
    // taken from base.js as their is no way to get 
    var requireSupportedForProcessing = WinJS.Utilities.requireSupportedForProcessing;
    function getValue(obj, path) {
        if (obj !== global) {
            obj = requireSupportedForProcessing(obj);
        }
        if (path) {
            for (var i = 0, len = path.length; i < len && (obj !== null && obj !== undefined); i++) {
                obj = requireSupportedForProcessing(obj[path[i]]);
            }
        }
        return obj;
    }

    WinJS.Namespace.define("Shopping.Binding", {
        twoway: WinJS.Binding.initializer(function (source, sourceProps, dest, destProps) {
            WinJS.Binding.defaultBind(source, sourceProps, dest, destProps);
            dest.onchange = function () {
                // leverage the oneTime binding in the reverse direction
                // oneTime binding doesn't support int values, so wrap it if needed.
                var value = getValue(dest, destProps);
                if (isInt(value)) {
                    dest = { value: parseInt(value) };
                    destProps = ["value"];
                }

                WinJS.Binding.oneTime(dest, destProps, source, sourceProps);
            };
        }),

        command: WinJS.Binding.initializer(function (source, sourceProps, dest, destProps) {
            //sourceProps.push("execute");
            var eventSource = dest;
            var command = source;
            var sourceItems = destProps.length;
            var destItems = sourceProps.length;
            for (var i = 0; i < sourceItems - 1; i++) {
                eventSource = eventSource[destProps[i]];
            }
            for (var x = 0; x < destItems ; x++) {
                command = command[sourceProps[x]];
            }

            //Subscribes the event
            eventSource[destProps[sourceItems - 1]] = function () {
                if (!WinJS.Utilities.hasClass(disabledClassName)) {
                    command["execute"].call(source, dest);
                }
            };

            //monitors canExecute
            command["canExecute"].bind("value", function (isEnabled) {
                var sourceType = eventSource.tagName.toLowerCase();
                if (isEnabled) {
                    WinJS.Utilities.removeClass(eventSource, disabledClassName);
                } else {
                    WinJS.Utilities.addClass(eventSource, disabledClassName);
                }

                if (sourceType == "button") {
                    eventSource.disabled = !isEnabled;
                }

            });
        }),
        
        RelayCommand : WinJS.Class.define(function(execute) {
            this.execute = execute;
            this.execute.supportedForProcessing = true;
            this.canExecute = WinJS.Binding.as({value:true});
        },
        {
            execute: null,
            canExecute: null
        }),


        setSelectedIndex: WinJS.Binding.initializer(function (source, sourceProperties, dest, destProperties) {
            /// <summary>
            /// Handles binding for selectedIndex property of a select html element
            /// </summary>

            var newDest = {};
            WinJS.Binding.defaultBind(source, sourceProperties, newDest, destProperties);

            var selectedIndex = -1;
            _.each(dest.options, function (v, k) {
                if (v.value == newDest.value) {
                    selectedIndex = k;
                }
            });

            dest.selectedIndex = selectedIndex;
            return;
        }),

        visibilityConverter: WinJS.Binding.converter(function (val) {
            /// <summary>
            /// Converts a boolean value to a display style for visibility
            /// </summary>
            return val ? "block" : "none";
        }),
        
        currencyConverter: WinJS.Binding.converter(function (num) {
            /// <summary>
            /// Converts a number to a currency formatted string.
            /// </summary>
            
            var settings = {
                symbol: '$',
                positiveFormat: '%s%n',
                negativeFormat: '(%s%n)',
                decimalSymbol: '.',
                digitGroupSymbol: ',',
                groupDigits: true,
                roundToDecimalPlace: 2 // roundToDecimalPlace: -1; for no rounding; 0 to round to the dollar; 1 for one digit cents; 2 for two digit cents; 3 for three digit cents; ...
            };

            var isPositive = (num == Math.abs(num));
            if (!isPositive && settings.disableNegative === true) {
                num = 0;
                isPositive = true;
            }

            // evalutate number input
            var numParts = String(num).split('.');
            var hasDecimals = (numParts.length > 1);
            var decimals = (hasDecimals ? numParts[1].toString() : '0');

            // format number
            num = Math.abs(numParts[0]);
            num = isNaN(num) ? 0 : num;
            if (settings.roundToDecimalPlace >= 0) {
                decimals = parseFloat('1.' + decimals); // prepend "0."; (IE does NOT round 0.50.toFixed(0) up, but (1+0.50).toFixed(0)-1
                decimals = decimals.toFixed(settings.roundToDecimalPlace); // round
                if (decimals.substring(0, 1) == '2') {
                    num = Number(num) + 1;
                }
                decimals = decimals.substring(2); // remove "0."
            }
            num = String(num);

            if (settings.groupDigits) {
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++) {
                    num = num.substring(0, num.length - (4 * i + 3)) + settings.digitGroupSymbol + num.substring(num.length - (4 * i + 3));
                }
            }

            if ((hasDecimals && settings.roundToDecimalPlace == -1) || settings.roundToDecimalPlace > 0) {
                num += settings.decimalSymbol + decimals;
            }

            // format symbol/negative
            var format = isPositive ? settings.positiveFormat : settings.negativeFormat;
            var money = format.replace(/%s/g, settings.symbol);
            money = money.replace(/%n/g, num);

            // set destination
            return money;

        })
    });
    
})(WinJS, this);