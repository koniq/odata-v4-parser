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

    // it('should propperly parse search with NOT', function () {
    //     var searchQuery = "$search=NOT yellow";
    //     var token = new Parser().query(searchQuery);
    //     var expected = {"position":0,"next":18,"value":{"options":[{"position":0,"next":18,"value":{"position":8,"next":18,"value":{"position":12,"next":18,"value":"yellow","type":"SearchPhrase","raw":"yellow"},"type":"SearchNotExpression","raw":"NOT yellow"},"type":"Search","raw":"$search=NOT yellow"}]},"type":"QueryOptions","raw":"$search=NOT yellow"};
    //     expect(token).to.be.deep.equal(expected);
    // });

    // it('should propperly parse search with double AND and single NOT', function () {
    //     var searchQuery = "$search=yellow AND blue AND NOT green";
    //     var token = new Parser().query(searchQuery);
    //     var expected = {"position":0,"next":37,"value":{"options":[{"position":0,"next":37,"value":{"position":8,"next":37,"value":{"left":{"position":8,"next":37,"value":"yellow","type":"SearchPhrase","raw":"yellow"},"right":{"position":19,"next":37,"value":{"left":{"position":19,"next":37,"value":"blue","type":"SearchPhrase","raw":"blue"},"right":{"position":28,"next":37,"value":{"position":32,"next":37,"value":"green","type":"SearchPhrase","raw":"green"},"type":"SearchNotExpression","raw":"NOT green"}},"type":"SearchAndExpression","raw":"blue AND NOT green"}},"type":"SearchAndExpression","raw":"yellow AND blue AND NOT green"},"type":"Search","raw":"$search=yellow AND blue AND NOT green"}]},"type":"QueryOptions","raw":"$search=yellow AND blue AND NOT green"};

    //     expect(token).to.be.deep.equal(expected);
    // });

    // it('should propperly parse search with double quoted phrase', function () {
    //     var searchQuery = '$search="yellow submarine"';
    //     var token = new Parser().query(searchQuery);
    //     var expected = {"position":0,"next":26,"value":{"options":[{"position":0,"next":26,"value":{"position":8,"next":26,"value":"yellow submarine","type":"SearchPhrase","raw":"\"yellow submarine\""},"type":"Search","raw":"$search=\"yellow submarine\""}]},"type":"QueryOptions","raw":"$search=\"yellow submarine\""};
    //     expect(token).to.be.deep.equal(expected);
    // });

    // it('should propperly parse search with OR and double quoted phrase', function () {
    //     var searchQuery = '$search=green OR "yellow submarine"';
    //     var token = new Parser().query(searchQuery);
    //     var expected = {"position":0,"next":35,"value":{"options":[{"position":0,"next":35,"value":{"position":8,"next":35,"value":{"left":{"position":8,"next":35,"value":"green","type":"SearchPhrase","raw":"green"},"right":{"position":17,"next":35,"value":"yellow submarine","type":"SearchPhrase","raw":"\"yellow submarine\""}},"type":"SearchOrExpression","raw":"green OR \"yellow submarine\""},"type":"Search","raw":"$search=green OR \"yellow submarine\""}]},"type":"QueryOptions","raw":"$search=green OR \"yellow submarine\""};
    //     expect(token).to.be.deep.equal(expected);
    // });

    //TODO test precedence operator
    // green OR blue AND white ==> green OR (blue AND white)
    // (green OR blue) AND white
    // green AND NOT blue AND white => green ((NOT blue) AND white
    // NOT (green OR blue)
    // green AND NOT blue OR white => (green AND (NOT blue)) OR white


});
