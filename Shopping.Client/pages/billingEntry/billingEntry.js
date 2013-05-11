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


/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/ui.js" />
/// <reference path="billingEntryViewModel.js" />

(function () {
    "use strict";

    var ui = WinJS.UI;
    var vm = new Shopping.ViewModel.BillingEntryViewModel();
    var page;

    ui.Pages.define("/pages/billingEntry/billingEntry.html", {
        
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            page = this;
            page.element = element;
            vm.init();
            vm.bind("SameAddresses", this.sameAddressChanged);
            
            WinJS.Binding.processAll(element, vm);
        },

        sameAddressChanged: function (isSame) {
            if (isSame) {
                var copy = function(srcSelector, destSelector) {
                    var src = page.element.querySelector(srcSelector);
                    var dest = page.element.querySelector(destSelector);
                    if (src && dest) {
                        if (src.tagName == "SELECT") {
                            dest.selectedIndex = src.selectedIndex;
                        } else {
                            dest.value = src.value;
                        }
                        if (dest.onchange) dest.onchange();
                    }
                };

                copy("#billing_first_name", "#shipping_first_name");
                copy("#billing_last_name", "#shipping_last_name");
                copy("#billing_line1", "#shipping_line1");
                copy("#billing_line2", "#shipping_line2");
                copy("#billing_city", "#shipping_city");
                copy("#billing_state", "#shipping_state");
                copy("#billing_zip", "#shipping_zip");
            }

            page._enableDisableShipping(isSame);
        },

        _enableDisableShipping: function(disabled) {
            WinJS.Utilities.query(".shippingAddress input[type=text], .shippingAddress select").forEach(function (el) {
                el.disabled = disabled;
            });
        }
        
    });
})();
