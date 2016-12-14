import { expect } from 'chai';
import { Parser } from '../lib/parser';
import { assertIsSubset } from '../lib/assert-utils';

describe('odataV4Parser filter', function () {
    it('4.8 Addressing the Count with greater than - resource test', function () {
        var filterQuery = "Categories?$filter=Products/$count lt 10";
        var token = new Parser().odataUri(filterQuery);

        expect(token.type).to.be.equal("ODataUri");
        expect(token.value.resource.type).to.be.equal("ResourcePath");
        expect(token.value.resource.raw).to.be.equal("Categories");
        var expectResourceValue = {
				"resource" : {
					"value" : {
						"name" : "Categories"
					},
					"type" : "EntitySetName",
					"raw" : "Categories"
				}
			};
        assertIsSubset(expectResourceValue, token.value.resource.value); 
    });

    it('4.8 Addressing the Count with greater than - filter test', function () {
        var filterQuery = "Categories?$filter=Products/$count lt 10";
        var token = new Parser().odataUri(filterQuery);
        var queryOptions = token.value.query.value.options[0];
        expect(queryOptions.type).to.be.equal("Filter");
        expect(queryOptions.raw).to.be.equal("$filter=Products/$count lt 10");

        var queryOptionsValue = queryOptions.value;
        expect(queryOptionsValue.raw).to.be.equal("Products/$count lt 10");
        var expected = {
                            "left" : {
                                "value" : {
                                    "value" : {
                                        "value" : {
                                            "current" : {
                                                "value" : {
                                                    "name" : "Products"
                                                },
                                                "type" : "ODataIdentifier",
                                                "raw" : "Products"
                                            },
                                        },
                                        "type" : "PropertyPathExpression",
                                        "raw" : "Products/$count"
                                    },
                                    "type" : "MemberExpression",
                                    "raw" : "Products/$count"
                                },
                                "type" : "FirstMemberExpression",
                                "raw" : "Products/$count"
                            },
                            "right" : {
                                "type" : "Literal",
                                "raw" : "10"
                            }
						};
        assertIsSubset(expected, queryOptionsValue.value);
    });

    it('4.9 Inheritance - $expand - startswith root test', function () {

        var filterQuery = "Categories?$expand=Products($filter=startswith(Name,'P'))";
        var token = new Parser().odataUri(filterQuery);

        var queryOptions = token.value.query.value.options[0];
        expect(queryOptions.type).to.be.equal("Expand");
        
        var queryItem = queryOptions.value.items[0];
        expect(queryItem.type).to.be.equal("ExpandItem");
        expect(queryItem.raw).to.be.equal("Products($filter=startswith(Name,'P'))");
    });

    it('4.9 Inheritance - $expand - startswith path test', function () {

        var filterQuery = "Categories?$expand=Products($filter=startswith(Name,'P'))";
        var token = new Parser().odataUri(filterQuery);

        var queryItemValue = token.value.query.value.options[0].value.items[0].value.path;
        var expectedPath = {
                            "value" : [{
                                    "position" : 19,
                                    "next" : 27,
                                    "value" : {
                                        "name" : "Products"
                                    },
                                    "type" : "EntityNavigationProperty",
                                    "raw" : "Products"
                                }
                            ],
                            "type" : "ExpandPath",
                            "raw" : "Products"
                        };
        assertIsSubset(expectedPath, queryItemValue);
    });

    it('4.9 Inheritance - $expand - startswith filter test', function () {

        var filterQuery = "Categories?$expand=Products($filter=startswith(Name,'P'))";
        var token = new Parser().odataUri(filterQuery);

        var optionItem = token.value.query.value.options[0].value.items[0].value.options[0];
        expect(optionItem.type).to.be.equal("Filter");
        expect(optionItem.raw).to.be.equal("$filter=startswith(Name,'P')");

        var optionItemValue = optionItem.value;
        expect(optionItemValue.type).to.be.equal("MethodCallExpression");
        expect(optionItemValue.raw).to.be.equal("startswith(Name,'P')");

        var expectedOptionItemValueOfValue = {
                                            "method" : "startswith",
                                            "parameters" : [{
                                                    "value" : {
                                                        "value" : {
                                                            "value" : {
                                                                "value" : {
                                                                    "name" : "Name"
                                                                },
                                                                "type" : "ODataIdentifier",
                                                            },
                                                            "type" : "PropertyPathExpression",
                                                            "raw" : "Name"
                                                        },
                                                        "type" : "MemberExpression",
                                                        "raw" : "Name"
                                                    },
                                                    "type" : "FirstMemberExpression",
                                                    "raw" : "Name"
                                                }, {
                                                    "value" : "Edm.String",
                                                    "type" : "Literal",
                                                    "raw" : "'P'"
                                                }
                                            ]
                                        };
        assertIsSubset(expectedOptionItemValueOfValue, optionItemValue.value);
    });

    it("Addressing wrong argument 'counts' with lower than expected to throw error", () => {
        var filterQuery = "Categories?$filter=Products/$counts lt 10";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Unexpected character at 34');
    });

    it("Addressing wrong operator 'ls' with count expected to throw error", () => {
        var filterQuery = "Categories?$filter=Products/$count lww 10";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Unexpected character at 34');
    });

    it("Addressing count with greater than operator without operators argument expected to throw error", () => {
        var filterQuery = "Categories?$filter=Products/$count gt   ";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Unexpected character at 34');
    });

    it("Addressing count with greater than operator with ampersand as argument expected to throw error", () => {
        var filterQuery = "Categories?$filter=Products/$count gt &";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Unexpected character at 34');
    });

    it("Addressing wrong function name 'filer' expected to fail", () => {
        var filterQuery = "Categories?$filer=Products/$count gt 1";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it("Addressing function with wrong special character '& instead of '$' expected to fail", () => {
        var filterQuery = "Categories?&filter=Products/$count gt 1";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });
});