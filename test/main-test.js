describe('pos-G1', function () {
    describe('buildCartItems()', function () {
        var allItems;

        beforeEach(function () {
            allItems = [
                {
                    barcode: 'ITEM000001',
                    name: '羽毛球',
                    unit: '个',
                    category: '体育器械',
                    subCategory: '球类',
                    price: 1.00
                },
                {
                    barcode: 'ITEM000003',
                    name: '苹果',
                    unit: '斤',
                    category: '食品',
                    subCategory: '水果',
                    price: 5.50
                }];
        });

        describe("if inputs is tag's barcode", function () {
            it("it can return tag's count", function () {
                var tags = ['ITEM000001', 'ITEM000001'];
                var result = buildCartItems(tags, allItems);

                expect(result).toEqual([
                    {
                        item: {
                            barcode: 'ITEM000001',
                            name: '羽毛球',
                            unit: '个',
                            category: '体育器械',
                            subCategory: '球类',
                            price: 1.00
                        },
                        count: 2
                    }
                ]);
            });
        });

        describe("if inputs is tag's barcode and count", function () {
            it("it can set tag's count", function () {
                var tags = ['ITEM000003-2'];
                var result = buildCartItems(tags, allItems);

                expect(result).toEqual([
                    {
                        item: {
                            barcode: 'ITEM000003',
                            name: '苹果',
                            unit: '斤',
                            category: '食品',
                            subCategory: '水果',
                            price: 5.50
                        },
                        count: 2
                    }
                ]);
            });
        });
    });

    describe('buildReceiptItem()', function () {
        var promotions;

        beforeEach(function () {
            promotions = [{
                type: 'BUY_THREE_GET_ONE_FREE',
                barcodes: ['ITEM000000', 'ITEM000001']
            }];
        });

        describe("cartItem's barcode is in promotions", function () {
            var cartItems;

            beforeEach(function () {
                cartItems = [{
                    item: {
                        barcode: 'ITEM000001',
                        name: '羽毛球',
                        unit: '个',
                        category: '体育器械',
                        subCategory: '球类',
                        price: 1.00
                    },
                    count: 5
                }];
            });
            it('cartItem can return result after been promoted', function () {
                var result = buildReceiptItem(cartItems, promotions);
                var expectResult = {
                    allItems: [{
                        cartItem: {
                            item: {
                                barcode: 'ITEM000001',
                                name: '羽毛球',
                                unit: '个',
                                category: '体育器械',
                                subCategory: '球类',
                                price: 1.00
                            },
                            count: 5
                        },
                        subtotal: 4.00,
                        saved: 1.00
                    }],
                    promotedItems: [{type: 'BUY_THREE_GET_ONE_FREE', items: [{name: '羽毛球', savedCount: 1, unit: '个'}]}]
                };

                expect(result).toEqual(expectResult);
            });
        });

        describe("cartItem's barcode is not in promotions", function () {
            var cartItems;

            beforeEach(function () {
                cartItems = [{
                    item: {
                        barcode: 'ITEM000003',
                        name: '苹果',
                        unit: '斤',
                        category: '食品',
                        subCategory: '水果',
                        price: 5.50
                    },
                    count: 2
                }];
            });
            it('cartItem will return origin result', function () {
                var result = buildReceiptItem(cartItems, promotions);
                var expectResult = {
                    allItems: [{
                        cartItem: {
                            item: {
                                barcode: 'ITEM000003',
                                name: '苹果',
                                unit: '斤',
                                category: '食品',
                                subCategory: '水果',
                                price: 5.50
                            },
                            count: 2
                        },
                        subtotal: 11.00,
                        saved: 0
                    }],
                    promotedItems: []
                };

                expect(result).toEqual(expectResult);
            });
        });
    });

    describe('buildReceipt()', function () {
        var receiptItem;

        describe('if there has something can be promoted', function () {

            beforeEach(function () {
                receiptItem = {
                    allItems: [{
                        cartItem: {
                            item: {
                                barcode: 'ITEM000001',
                                name: '羽毛球',
                                unit: '个',
                                category: '体育器械',
                                subCategory: '球类',
                                price: 1.00
                            },
                            count: 5
                        },
                        subtotal: 4.00,
                        saved: 1.00
                    }],
                    promotedItems: [{type: 'BUY_THREE_GET_ONE_FREE', items: [{name: '羽毛球', savedCount: 1, unit: '个'}]}]
                };
            });

            it('it can return correct receipt', function () {
                var result = buildReceipt(receiptItem);
                var expectResult = {
                    receipt: {
                        receiptItems: [{
                            cartItem: {
                                item: {
                                    barcode: 'ITEM000001',
                                    name: '羽毛球',
                                    unit: '个',
                                    category: '体育器械',
                                    subCategory: '球类',
                                    price: 1.00
                                },
                                count: 5
                            },
                            subtotal: 4.00,
                            saved: 1.00
                        }],
                        total: 4.00,
                        savedTotal: 1.00
                    },
                    promotion: [{type: 'BUY_THREE_GET_ONE_FREE', items: [{name: '羽毛球', savedCount: 1, unit: '个'}]}]
                };

                expect(result).toEqual(expectResult);
            });
        });

        describe('if there has nothing can be promoted', function () {

            beforeEach(function () {
                receiptItems = {
                    allItems: [{
                        cartItem: {
                            item: {
                                barcode: 'ITEM000003',
                                name: '苹果',
                                unit: '斤',
                                category: '食品',
                                subCategory: '水果',
                                price: 5.50
                            },
                            count: 2
                        },
                        subtotal: 11.00,
                        saved: 0
                    }],
                    promotedItems: []
                };
            });

            it('it can return correct receipt', function () {
                var result = buildReceipt(receiptItems);
                var expectResult = {
                    receipt: {
                        receiptItems: [{
                            cartItem: {
                                item: {
                                    barcode: 'ITEM000003',
                                    name: '苹果',
                                    unit: '斤',
                                    category: '食品',
                                    subCategory: '水果',
                                    price: 5.50
                                },
                                count: 2
                            },
                            subtotal: 11.00,
                            saved: 0
                        }],
                        total: 11.00,
                        savedTotal: 0
                    },
                    promotion: []
                };

                expect(result).toEqual(expectResult);
            });
        });
    });

    describe('buildReceiptText()', function () {
        var receipt;

        describe('if there has something can be promoted', function () {
            beforeEach(function () {
                receipt = {
                    receipt: {
                        receiptItems: [{
                            cartItem: {
                                item: {
                                    barcode: 'ITEM000001',
                                    name: '羽毛球',
                                    unit: '个',
                                    category: '体育器械',
                                    subCategory: '球类',
                                    price: 1.00
                                },
                                count: 5
                            },
                            subtotal: 4.00,
                            saved: 1.00
                        }],
                        total: 4.00,
                        savedTotal: 1.00
                    },
                    promotion: [{type: 'BUY_THREE_GET_ONE_FREE', items: [{name: '羽毛球', savedCount: 1, unit: '个'}]}]
                };
            });

            it('it should generate correct receipt', function () {
                var result = buildReceiptText(receipt);
                var expectResult = '***<没钱赚商店>收据***\n' +
                    '名称：羽毛球，数量：5个，单价：1.00(元)，小计：4.00(元)\n' +
                    '买三免一商品：' +
                    ' 名称：羽毛球，数量：1个\n' +
                    '总计：4.00(元)，节省：1.00(元)'

                expect(result).toEqual(expectResult);
            });
        });

        describe('if there has nothing can be promoted', function () {
            beforeEach(function () {
                receipt = {
                    receipt: {
                        receiptItems: [{
                            cartItem: {
                                item: {
                                    barcode: 'ITEM000003',
                                    name: '苹果',
                                    unit: '斤',
                                    category: '食品',
                                    subCategory: '水果',
                                    price: 5.50
                                },
                                count: 2
                            },
                            subtotal: 11.00,
                            saved: 0
                        }],
                        total: 11.00,
                        savedTotal: 0
                    },
                    promotion: []
                };
            });

            it('it should return correct text', function () {
                var result = buildReceiptText(receipt);
                expect(result).toEqual('***<没钱赚商店>收据***\n' +
                    '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)\n' +
                    '总计：11.00(元)');
            });
        });
    });
});