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
/// <reference path="/js/binding.js" />
/// <reference path="/js/api.js" />

(function (WinJS, nav, api) {
    "use strict";

    var AddressViewModel = WinJS.Binding.define({
        FirstName: "",
        LastName: "",
        Line1: "",
        Line2: "",
        City: "",
        State: "",
        Zip: ""
    });

    var PaymentViewModel = WinJS.Binding.define({
        CardType: "",
        CardNumber: "",
        CvvCode: 0,
        ExpirationMonth: 0,
        ExpirationYear: 0
    });


    WinJS.Namespace.define("Shopping.ViewModel", {
        BillingEntryViewModel: WinJS.Class.define(function BillingEntryViewModel_ctor() {
            this._initObservable();
            
            this.continueCommand = new Shopping.Binding.RelayCommand(this.continue);
            this.demoDataCommand = new Shopping.Binding.RelayCommand(this.demoData);

        }, {
            init: function () {
                var self = this;
                this.cart = api.cart.cart || {};
                
                this.BillingAddress = new AddressViewModel(this.cart.BillingAddress);
                this.ShippingAddress = new AddressViewModel(this.cart.ShippingAddress);
                this.PaymentInfo = new PaymentViewModel(this.cart.PaymentInfo);
                this.SameAddresses = this.cart.SameAddresses;
                this.Terms = this.cart.Terms;

                this.bind('Terms', function(hasAcceptedTerms) {
                    self.continueCommand.canExecute.value = hasAcceptedTerms;
                });
            },
            
            'continue': function () {
                this.cart.SameAddresses = this.SameAddresses;
                this.cart.Terms = this.Terms;

                nav.navigate('/pages/cart/cart.html', { view: 'confirmation' });
            },
            
            demoData: function() {

                var billingAddress = this.cart.BillingAddress || {};
                var demoFirstName = billingAddress.FirstName;
                if ((demoFirstName == null) || (demoFirstName == "")) {
                    demoFirstName = "Jane";
                }
                var demoLastName = billingAddress.LastName;
                if ((demoLastName == null) || (demoLastName == "")) {
                    demoLastName = "Doe";
                }

                this.BillingAddress.FirstName = demoFirstName;
                this.BillingAddress.LastName = demoLastName;
                this.BillingAddress.Line1 = "62 West 45th Street";
                this.BillingAddress.Line2 = "5th Floor";
                this.BillingAddress.City = "New York";
                this.BillingAddress.State = "NY";
                this.BillingAddress.Zip = "10036";

                this.ShippingAddress.FirstName = "John";
                this.ShippingAddress.LastName = "Doe";
                this.ShippingAddress.Line1 = "175 Capital Boulevard";
                this.ShippingAddress.Line2 = "Suite 401";
                this.ShippingAddress.City = "Rocky Hill";
                this.ShippingAddress.State = "CT";
                this.ShippingAddress.Zip = "06067";

                this.PaymentInfo.CardType = "Visa";
                this.PaymentInfo.CardNumber = "4444-4444-4444-4448";
                this.PaymentInfo.CvvCode = 432;
                this.PaymentInfo.ExpirationMonth = 6;
                this.PaymentInfo.ExpirationYear = 2015;

                this.SameAddresses = false;
                this.Terms = true;
            }
        })
    });
    
    WinJS.Class.mix(Shopping.ViewModel.BillingEntryViewModel,
        WinJS.Binding.mixin,
        WinJS.Binding.expandProperties({ SameAddresses: false, Terms: false }));
    
})(WinJS, WinJS.Navigation, Shopping.Api);