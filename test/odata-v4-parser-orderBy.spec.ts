import { expect } from 'chai';
import { Parser } from '../lib/parser';
import { assertIsSubset } from '../lib/assert-utils';

describe('odataV4Parser orderBy', function () {
    it('5.1.4 Categories OrderBy Name', function () {
        var orderByQuery = "Categories?$orderby=Name";
        var token = new Parser().odataUri(orderByQuery);

        expect(token.value.query.type).to.be.equal("QueryOptions");
        expect(token.value.query.raw).to.be.equal("$orderby=Name");

        var queryOption = token.value.query.value.options[0];
        expect(queryOption.type).to.be.equal("OrderBy");
        expect(queryOption.raw).to.be.equal("$orderby=Name");

        var queryOptionItem = queryOption.value.items[0];
        expect(queryOptionItem.type).to.be.equal("OrderByItem");
        expect(queryOptionItem.raw).to.be.equal("Name");
        console.log(JSON.stringify(queryOptionItem));
        expect(queryOptionItem.value.direction).to.be.equal(1);

        var queryOptionItemValueExpr = queryOptionItem.value.expr;
        expect(queryOptionItemValueExpr.type).to.be.equal("CommonExpression");
        expect(queryOptionItemValueExpr.raw).to.be.equal("Name");

        // var expectResourceValue = {
		// 		"resource" : {
		// 			"value" : {
		// 				"name" : "Categories"
		// 			},
		// 			"type" : "EntitySetName",
		// 			"raw" : "Categories"
		// 		}
		// 	};
        // assertIsSubset(expectResourceValue, token.value.resource.value); 
    });
});