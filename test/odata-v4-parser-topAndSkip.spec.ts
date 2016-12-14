import { expect } from 'chai';
import { Parser } from '../lib/parser';
import { assertIsSubset } from '../lib/assert-utils';

describe('odataV4Parser top and skip', function () {
    it('2 URL Components - resource path and query options - top', function () {
        var filterQuery = "Categories(1)/Products?$top=2&$orderby=Name";
        var token = new Parser().odataUri(filterQuery);

        var expectedTop = {
            "value": {
                "value": "Edm.Int32",
                "type": "Literal",
                "raw": "2"
            },
            "type": "Top",
            "raw": "$top=2"
        };
        assertIsSubset(expectedTop, token.value.query.value.options[0]);
    });

    it('5.1.5 Top and Skip resource', function () {
        var filterQuery = "Categories?$top=5&$skip=10";
        var token = new Parser().odataUri(filterQuery);

        var resource = token.value.resource;
        expect(resource.type).to.be.equal("ResourcePath");
        expect(resource.raw).to.be.equal("Categories");

        var expectResourceValue = {
            "resource": {
                "value": {
                    "name": "Categories"
                },
                "type": "EntitySetName",
                "raw": "Categories"
            }
        };
        assertIsSubset(expectResourceValue, resource.value);
    });

    it('5.1.5 Top and Skip query', function () {
        var filterQuery = "Categories?$top=5&$skip=10";
        var token = new Parser().odataUri(filterQuery);

        var query = token.value.query;
        expect(query.type).to.be.equal("QueryOptions");
        expect(query.raw).to.be.equal("$top=5&$skip=10");

        var queryValueOptionOne = query.value.options[0];
        var expectedOptionOne = {
            "value": {
                "value": "Edm.Int32",
                "type": "Literal",
                "raw": "5"
            },
            "type": "Top",
            "raw": "$top=5"
        };
        var queryValueOptionTwo = query.value.options[1];
        assertIsSubset(expectedOptionOne, queryValueOptionOne);

        var expectedOptionTwo = {
            "value": {
                "value": "Edm.Int32",
                "type": "Literal",
                "raw": "10"
            },
            "type": "Skip",
            "raw": "$skip=10"
        };
        assertIsSubset(expectedOptionTwo, queryValueOptionTwo);
    });

    it('Top with character argument expected to throw error', function () {
        var filterQuery = "Categories?$top=a";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('Top without argument expected to throw error', function () {
        var filterQuery = "Categories?$top= ";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('Top with special character argument expected to throw error', function () {
        var filterQuery = "Categories?$top=_";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('Skip with special character argument expected to throw error', function () {
        var filterQuery = "Categories?$skip=_";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('Skip without argument expected to throw error', function () {
        var filterQuery = "Categories?$skip=";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });

    it('Skip with character argument expected to throw error', function () {
        var filterQuery = "Categories?$skip=a";
        expect(() => new Parser().odataUri(filterQuery)).to.throw(Error, 'Fail at 0');
    });
});