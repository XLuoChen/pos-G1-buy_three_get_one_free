function printReceipt(tags) {
    var allItems = loadAllItems();
    var cartItems = buildCartItems(tags, allItems);

    var promotions = loadPromotions();
    var receiptItem = buildReceiptItem(cartItems, promotions);

    var receipt = buildReceipt(receiptItem);

    var receiptText = buildReceiptText(receipt);

    console.log(receiptText);
}

function buildCartItems(tags, allItems) {
    var cartItems = [];

    tags.forEach(function (tag) {
        var tagArray = tag.split('-');
        var barcode = tagArray[0];
        var count = parseFloat(tagArray[1] || 1);
        var item = findItem(barcode, allItems);
        var existItem = findExistItem(item, cartItems);

        if (existItem) {
            existItem.count++;
        }
        else {
            cartItems.push({item: item, count: count});
        }
    });

    return cartItems;
}

function findItem(barcode, items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].barcode === barcode) {
            return items[i];
        }
    }
}

function findExistItem(item, cartItems) {
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].item.barcode === item.barcode)
            return cartItems[i];
    }
}

function buildReceiptItem(cartItems, promotions) {
    var receiptItem = {};

    cartItems.forEach(function (cartItem) {
        var subtotal = cartItem.count * cartItem.item.price;
        var savedCount = 0;
        var saved = 0;
        var promotionObject = {};
        var promotedItems = [];
        var promotionInfo = getPromotionInfo(cartItem, promotions);

        if (promotionInfo.type === 'BUY_THREE_GET_ONE_FREE') {
            savedCount = parseInt(cartItem.count / 3);
            saved = savedCount * cartItem.item.price;
            subtotal -= saved;

            promotionObject.type = promotionInfo.type;
            var tempArray = [];
            tempArray.push({name: cartItem.item.name, savedCount: savedCount, unit: cartItem.item.unit});
            promotionObject.items = tempArray;
            promotedItems.push(promotionObject);
        }
        var allItems = [];
        allItems.push({cartItem: cartItem, subtotal: subtotal, saved: saved});

        receiptItem.allItems = allItems;
        receiptItem.promotedItems = promotedItems;
    });

    return receiptItem;
}

function getPromotionInfo(cartItem, promotions) {
    var promotionInfo = {};
    var barcode = cartItem.item.barcode;

    for (var i = 0; i < promotions.length; i++) {
        var barcodes = promotions[i].barcodes;

        if (isExist(barcode, barcodes)) {
            promotionInfo = promotions[i];
        }
    }

    return promotionInfo;
}

function isExist(barcode, barcodes) {
    for (var i = 0; i < barcodes.length; i++) {
        if (barcode === barcodes[i]) {
            return true;
        }
    }

    return false;
}

function buildReceipt(receiptItem) {
    var total = 0;
    var savedTotal = 0;

    for (var i = 0; i < receiptItem.allItems.length; i++) {
        total += receiptItem.allItems[i].subtotal;
        savedTotal += receiptItem.allItems[i].saved;
    }

    return {
        receipt: {
            receiptItems: receiptItem.allItems,
            total: total,
            savedTotal: savedTotal
        },
        promotion: receiptItem.promotedItems
    };
}

function buildReceiptText(receipt) {

    var receiptText = '***<没钱赚商店>收据***\n';

    if (receipt.promotion.length === 0) {
        receiptText += generateText(receipt)
            + '总计：' + receipt.receipt.total.toFixed(2) + '(元)';
    }
    else {
        receiptText += generateText(receipt);

        receipt.promotion.forEach(function (item) {
            receiptText += generatePromotedText(item);
        });

        receiptText += '\n总计：' + receipt.receipt.total.toFixed(2) + '(元)'
            + '，节省：' + receipt.receipt.savedTotal.toFixed(2) + '(元)';
    }

    return receiptText;
}

function generatePromotedText(promotion) {
    var text = '';

    if (promotion.type === 'BUY_THREE_GET_ONE_FREE') {
        text += '买三免一商品：';
    }
    promotion.items.forEach(function (item) {
        text += ' 名称：' + item.name + '，数量：' + item.savedCount + item.unit;
    });

    return text;
}

function generateText(receipt) {
    var text = '';

    for (var i = 0; i < receipt.receipt.receiptItems.length; i++) {
        var receiptInstead = receipt.receipt.receiptItems[i];
        text += '名称：' + receiptInstead.cartItem.item.name
            + '，数量：' + receiptInstead.cartItem.count + receiptInstead.cartItem.item.unit
            + '，单价：' + receiptInstead.cartItem.item.price.toFixed(2) + '(元)'
            + '，小计：' + receiptInstead.subtotal.toFixed(2) + '(元)\n';
    }

    return text;
}
