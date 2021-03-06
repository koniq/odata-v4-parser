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
        expect(queryOptionItem.value.direction).to.be.equal(1);

        var valueofFirstMember = queryOptionItem.value.expr.value;
        expect(valueofFirstMember.type).to.be.equal("FirstMemberExpression");
        expect(valueofFirstMember.raw).to.be.equal("Name");
    });

    it('5.1.4 Categories OrderBy Name asc', function () {
        var orderByQuery = "Categories?$orderby=Name asc";
        var token = new Parser().odataUri(orderByQuery);

        expect(token.value.query.type).to.be.equal("QueryOptions");
        expect(token.value.query.raw).to.be.equal("$orderby=Name asc");

        var queryOption = token.value.query.value.options[0];
        expect(queryOption.type).to.be.equal("OrderBy");
        expect(queryOption.raw).to.be.equal("$orderby=Name asc");

        var queryOptionItem = queryOption.value.items[0];
        expect(queryOptionItem.type).to.be.equal("OrderByItem");
        expect(queryOptionItem.raw).to.be.equal("Name asc");
        expect(queryOptionItem.value.direction).to.be.equal(1);

        var valueofFirstMember = queryOptionItem.value.expr.value;
        expect(valueofFirstMember.type).to.be.equal("FirstMemberExpression");
        expect(valueofFirstMember.raw).to.be.equal("Name");
    });

    it('5.1.4 Categories OrderBy Value desc', function () {
        var orderByQuery = "Categories?$orderby=Value desc";
        var token = new Parser().odataUri(orderByQuery);

        expect(token.value.query.type).to.be.equal("QueryOptions");
        expect(token.value.query.raw).to.be.equal("$orderby=Value desc");

        var queryOption = token.value.query.value.options[0];
        expect(queryOption.type).to.be.equal("OrderBy");
        expect(queryOption.raw).to.be.equal("$orderby=Value desc");

        var queryOptionItem = queryOption.value.items[0];
        expect(queryOptionItem.type).to.be.equal("OrderByItem");
        expect(queryOptionItem.raw).to.be.equal("Value desc");
        expect(queryOptionItem.value.direction).to.be.equal(-1);

        var valueofFirstMember = queryOptionItem.value.expr.value;
        expect(valueofFirstMember.type).to.be.equal("FirstMemberExpression");
        expect(valueofFirstMember.raw).to.be.equal("Value");
    });

    it('5.1.4 Categories complex OrderBy Value desc,Name asc', function () {
        var orderByQuery = "Categories?$orderby=Value desc,Name asc";
        var token = new Parser().odataUri(orderByQuery);

        expect(token.value.query.type).to.be.equal("QueryOptions");
        expect(token.value.query.raw).to.be.equal("$orderby=Value desc,Name asc");

        var queryOption = token.value.query.value.options[0];
        expect(queryOption.type).to.be.equal("OrderBy");
        expect(queryOption.raw).to.be.equal("$orderby=Value desc,Name asc");

        var queryOptionItemOne = queryOption.value.items[0];
        expect(queryOptionItemOne.type).to.be.equal("OrderByItem");
        expect(queryOptionItemOne.raw).to.be.equal("Value desc");
        expect(queryOptionItemOne.value.direction).to.be.equal(-1);

        var valueofFirstMember = queryOptionItemOne.value.expr.value;
        expect(valueofFirstMember.type).to.be.equal("FirstMemberExpression");
        expect(valueofFirstMember.raw).to.be.equal("Value");

        var queryOptionItemTwo = queryOption.value.items[1];
        expect(queryOptionItemTwo.type).to.be.equal("OrderByItem");
        expect(queryOptionItemTwo.raw).to.be.equal("Name asc");
        expect(queryOptionItemTwo.value.direction).to.be.equal(1);
        
        var valueofSecondMember = queryOptionItemTwo.value.expr.value;
        expect(valueofSecondMember.type).to.be.equal("FirstMemberExpression");
        expect(valueofSecondMember.raw).to.be.equal("Name");
    });

    it('OrderBy without "=" before argument expected to throw error', function () {
        var filterQuery = "Categories?$orderby a";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('OrderBy without argument expected to throw error', function () {
        var filterQuery = "Categories?$orderby=";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('OrderBy with special character as argument expected to throw error', function () {
        var filterQuery = "Categories?$orderby=&";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('OrderBy with $count as argument expected to throw error', function () {
        var filterQuery = "Categories?$orderby=$count";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });
});