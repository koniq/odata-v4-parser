import { expect } from 'chai';
import {assertIsSubset} from '../lib/assert-utils';

describe('assertIsSubset own test', function () {

    it('should pass when both objects are empty', function () {
        var expected = {   };
        var actual = {  }

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });

    it('should pass when both objects have the same primitive values', function () {
        var expected = { 
            'key1': 'value1',
            'key2': 4353,
            'key3': true,
            'key4': null,
        };

        var actual = {  
            'key1': 'value1',
            'key2': 4353,
            'key3': true,
            'key4': null,
        }

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });

    it('should pass when both objects have the same primitive values (nested)', function () {
        var expected = { 
            'key1': 'value1',
            'key2': {
                'nestedKey1': 'value2',
                'nestedKey2': { 
                    'yetAnotherKey': 1
                }
            }
        };

        var actual = {  
            'key1': 'value1',
            'key2': {
                'nestedKey1': 'value2',
                'nestedKey2': { 
                    'yetAnotherKey': 1
                }
            }
        }

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });

    it('should pass when expected is a subset of actual', function () {
        var expected = { 
            'key1': 'value1',
            'key4': null,
        };

        var actual = {  
            'key1': 'value1',
            'key2': 4353,
            'key3': true,
            'key4': null,
        }

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });

    it('should pass when expected is a subset of actual (nested)', function () {
        var expected = { 
            'key2': {
                'nestedKey2': { 
                    'yetAnotherKey': 1
                }
            }
        };

        var actual = {  
            'key1': 'value1',
            'key2': {
                'nestedKey1': 'value2',
                'nestedKey2': { 
                    'yetAnotherKey': 1
                }
            }
        }

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });

    it('should pass when values are equal arrays', function () {
        var expected = { 
            'key1': [ 1, 2, 3 ]
        };
        var actual = { 
            'key1': [ 1, 2, 3 ]
        };

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });

/* --todo: discuss
    it('should pass when expected array is a subset of actual array', function () {
        var expected = { 
            'key1': [ 1, 2, 3 ]
        };
        var actual = { 
            'key1': [ 8, 1, 5, 2, 3, 6 ]
        };

        expect(function () { assertIsSubset(expected, actual); }).to.not.throw();
    });
    */

    //fail
    
    it('should fail when actual doesnt have property', function () {
        var expected = { 
            'key1': 'value1',
            'key2': 'value2',
        };
        var actual = { 
            'key1': 'value1',
            //'key2': 'value2',
        }

        expect(function () { assertIsSubset(expected, actual); }).to.throw("There is no key2 field");
    });

    it('should fail when actual doesnt have property (nested)', function () {
        var expected = { 
            'key1': 'value1',
            'key2': {
                'nestedKey1': 1,
                'nestedKey2': 2
            }
        };
        var actual = { 
            'key1': 'value1',
            'key2': {
                'nestedKey1': 1,
                //'nestedKey2': 2
            }
        }

        expect(function () { assertIsSubset(expected, actual); }).to.throw("There is no nestedKey2 field");
    });

    it('should fail when actual has different primitive value than expected', function () {
        var expected = { 
            'key1': 'value1',
            'key2': 'value2',
        };
        var actual = { 
            'key1': 'value1',
            'key2': 'valuex',
        }

        expect(function () { assertIsSubset(expected, actual); }).to.throw("Field key2 has different value");
    });
});