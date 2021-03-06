﻿//*************************************************************************
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
/// <reference path="/js/api.js" />

(function (WinJS, api) {
    "use strict";
    
    WinJS.Namespace.define("Shopping.ViewModel", {
        CategoriesViewModel : WinJS.Class.define(function CategoriesViewModel_ctor(catalog) {

            this.catalog = catalog;

        }, {

            init: function (area) {
                /// <summary locid="Shopping.ViewModel.CategoriesViewModel.init">
                /// loads the data for the specified area.
                /// </summary>
                var catalog = this.catalog;

                this.area = area;
                this.list = new WinJS.Binding.List(catalog.getProductsForArea(area));

                this.categories = this.list.createGrouped(
                            function groupKeySelector(product) { return product.Category; },
                            function groupDataSelector(product) {
                                return {
                                    Category: product.Category,
                                    CategoryImage: product.CategoryImage,
                                    ItemCount: catalog.getProductCountForCategory(product.Category)
                                };
                            }
                        );
            }
        })
    });

})(WinJS, Shopping.Api);