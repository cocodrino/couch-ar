
var TestUser
var domain;

describe('init() method', function() {
    it('creates db', function() {
        domain = require('couch-ar');
        domain.init({
            dbName: 'couch-ar-test',
            root: __dirname + '/../testDomain'
        }, function() {
            // delay so that everything can be setup
            setTimeout(asyncSpecDone, 500);
        });
        asyncSpecWait();
    });

    it('adds the domain constructors to couch-ar', function() {
        expect(require('couch-ar').TestUser).toBeDefined();
    });
});


describe('TestUser', function() {

    describe('save() method', function() {
        var user;
        var rev;
        it('should set id and rev before callback', function() {
            user = domain.TestUser.create({username:'tester1', firstName:'Test', lastName:'Tester'});
            user.save(function(err, res) {
                rev = user.rev;
                expect(res.ok).toBeTruthy();
                expect(user.id).toBeDefined();
                expect(user.rev).toBeDefined();
                asyncSpecDone();
            });
            asyncSpecWait();
        });

        it('should allow us to update the object after initial save', function() {
            user.username = 'tester';
            user.save(function(err, res) {
                expect(res.ok).toBeTruthy();
                expect(user.id).toBeDefined();
                expect(user.rev).toBeDefined();
                expect(rev).not.toEqual(user.rev);
                asyncSpecDone();
            });
            asyncSpecWait();

        })

        it('should call beforeSave method before writing to the db', function() {
            expect(user.fullName).toEqual('Test Tester');
        })
    })

    describe('findByUsername() method', function() {
        it('should find user when using findByUsername', function() {
            domain.TestUser.findByUsername('tester', function(user) {
                expect(user.username).toEqual('tester');
                expect(user.id).toBeDefined();
                expect(user.rev).toBeDefined();
                asyncSpecDone();
            });
            asyncSpecWait();
        });
    });

    describe('findById() method', function() {
        it('should find a user using findById', function() {
            domain.TestUser.findByUsername('tester', function(user){
                domain.TestUser.findById(user.id, function(user){
                    expect(user.username).toEqual('tester');
                    expect(user.id).toBeDefined();
                    expect(user.rev).toBeDefined();
                    asyncSpecDone();
                });
            });
            asyncSpecWait();
        });
    });


    describe('list() method', function() {
        it('should show records in db', function() {
            domain.TestUser.list(function(users){
                expect(users.length).toBeGreaterThan(0);
            });
        });
    }); 




    describe('remove() method', function() {
        it('should remove a record from couchDb', function() {
            domain.TestUser.findAllByUsername('tester', function(users) {
                (function removeAll(user) {
                    user.remove(function(err, res) {
                        expect(res.ok).toBeTruthy();
                        users.length ? removeAll(users.shift()) : asyncSpecDone();
                    });
                }(users.shift()))
            });
        });
        asyncSpecWait();
    });

});