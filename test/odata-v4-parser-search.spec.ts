import { expect } from 'chai';
import { Parser } from '../lib/parser';
import { assertIsSubset } from '../lib/assert-utils';

describe('odataV4Parser search', function () {

 it('should propperly parse search with single AND', function () {
        
        var searchQuery = "$search=blue AND red"
        var token = new Parser().query(searchQuery);

        expect(token.type).to.be.equal("QueryOptions");
        var searchOptions = token.value.options[0];
        expect(searchOptions.type).to.be.equal("Search");
        var searchOptionsValue = searchOptions.value;

         var expectPoC = {
                          "type": "SearchAndExpression",
                          "value":{
                              "left":
                              {
                                  "type": "SearchPhrase",
                                  "value": "blue"
                              },
                              "right":
                              {
                                  "type": "SearchPhrase",
                                  "value": "red"
                              }
                          }
                     };

        assertIsSubset(expectPoC, searchOptionsValue);
    });

    it('should propperly parse search with double AND', function () {

        var searchQuery = "$search=yellow AND blue AND green";
        var token = new Parser().query(searchQuery);

        expect(token.type).to.be.equal("QueryOptions");
        var searchOptions = token.value.options[0];
        expect(searchOptions.type).to.be.equal("Search");
        var searchOptionsValue = searchOptions.value;

         var expectPoC = {
                          "type": "SearchAndExpression",
                          "value":{
                              "left":
                              {
                                  "type": "SearchPhrase",
                                  "value": "yellow"
                              },
                              "right":
                              {
                                  "raw":"blue AND green",
                                  "type": "SearchAndExpression",
                                  "value": 
                                  {
                                     "left":{
                                         "type": "SearchPhrase",
                                         "value": "blue"
                                     },
                                     "right":{
                                         "type": "SearchPhrase",
                                         "value": "green"
                                     }
                                  }
                              }
                          }
                     };

        assertIsSubset(expectPoC, searchOptionsValue);
    });

    it('should propperly parse search with NOT', function () {
        var searchQuery = "$search=NOT yellow";
        var token = new Parser().query(searchQuery);

        expect(token.type).to.be.equal("QueryOptions");
        var searchOptions = token.value.options[0];
        expect(searchOptions.type).to.be.equal("Search");
        var searchOptionsValue = searchOptions.value;
        
        var expectPoC = {
                        "type" : "SearchNotExpression",
                        "raw" : "NOT yellow",
                        "value":{
                            "value" : "yellow",
						    "type" : "SearchPhrase",
						    "raw" : "yellow"
                        }
                    };
        assertIsSubset(expectPoC, searchOptionsValue);
    });

    it('should propperly parse search with double AND and single NOT', function () {
        var searchQuery = "$search=yellow AND blue AND NOT green";
        var token = new Parser().query(searchQuery);

        expect(token.type).to.be.equal("QueryOptions");
        var searchOptions = token.value.options[0];
        expect(searchOptions.type).to.be.equal("Search");
        var searchOptionsValue = searchOptions.value;
        
        var expectPoC = {
                        "type" : "SearchAndExpression",
                        "raw" : "yellow AND blue AND NOT green",
                        "value":{
                           "left" : {							
                                "value" : "yellow",
							    "type" : "SearchPhrase",
							    "raw" : "yellow"
                            },
                           "right" : {
                               "type" : "SearchAndExpression",
							   "raw" : "blue AND NOT green",
                               "value" : {
                                   "left" : {
                                        "value" : "blue",
                                        "type" : "SearchPhrase",
                                        "raw" : "blue"
								    },
								    "right" : {
                                        "value" : {
                                            "value" : "green",
                                            "type" : "SearchPhrase",
                                            "raw" : "green"
									},
									"type" : "SearchNotExpression",
									"raw" : "NOT green"
								}}
                           }
                        }
                    };
        assertIsSubset(expectPoC, searchOptionsValue);

    });

    it('should propperly parse search with double quoted phrase', function () {
        var searchQuery = '$search="yellow submarine"';
        var token = new Parser().query(searchQuery);

        expect(token.type).to.be.equal("QueryOptions");
        var searchOptions = token.value.options[0];
        expect(searchOptions.type).to.be.equal("Search");
        var searchOptionsValue = searchOptions.value;
        var expectPoC = {
                "value" : "yellow submarine",
                "type" : "SearchPhrase"
        };

        assertIsSubset(expectPoC, searchOptionsValue);
    });

    it('should propperly parse search with OR and double quoted phrase', function () {
        var searchQuery = '$search=green OR "yellow submarine"';
       var token = new Parser().query(searchQuery);

        expect(token.type).to.be.equal("QueryOptions");
        var searchOptions = token.value.options[0];
        expect(searchOptions.type).to.be.equal("Search");
        var searchOptionsValue = searchOptions.value;
        var expectPoC = {
                "type" : "SearchOrExpression",
                "raw" : "green OR \"yellow submarine\"",
                "value" : {
						"left" : {
							"value" : "green",
							"type" : "SearchPhrase",
							"raw" : "green"
						},
						"right" : {
							"value" : "yellow submarine",
							"type" : "SearchPhrase",
							"raw" : "\"yellow submarine\""
						}
                }
        };

        assertIsSubset(expectPoC, searchOptionsValue);
    });

    //TODO test precedence operator
    // green OR blue AND white ==> green OR (blue AND white)
    // (green OR blue) AND white
    // green AND NOT blue AND white => green ((NOT blue) AND white)
    // NOT (green OR blue)
    // green AND NOT blue OR white => (green AND (NOT blue)) OR white
});
