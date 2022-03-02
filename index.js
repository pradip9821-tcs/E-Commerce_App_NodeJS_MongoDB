exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
      .then(order => {
        if (!order) {
          return next(new Error('No order found !!'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
          return next(new Error('User unauthorized !!'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
  
        const pdfDoc = new PDFDocument({ size: 'A4' });
  
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
  
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(15).font('Times-Roman').fillColor('black').text('------------------------------------------------------------------------------------------', {
          align: 'center'
        });
        pdfDoc.fontSize(30).fillColor('red').text('Invoice', {
          align: 'center'
        }).moveDown(-0.2);
        pdfDoc.fontSize(15).fillColor('black').text('------------------------------------------------------------------------------------------', {
          align: 'center'
        });
        let total = 0;
        order.products.forEach(prod => {
          const subTotal = parseInt(prod.quantity) * parseFloat(prod.product.price);
          total += subTotal;
          pdfDoc.text('  ');
          pdfDoc.font('Times-Roman').fontSize(15).text(prod.product.title + '   -  ' + prod.quantity + ' x ' + ' $ ' + prod.product.price + ' /-');
          pdfDoc.font('Times-Bold').fontSize(12).text('Sub Total : $ ' + subTotal + ' /-', {
            align: 'left',
          })
        });
        pdfDoc.text('  ');
        pdfDoc.font('Times-Roman').fontSize(15).fillColor('black').text('------------------', {
          align: 'right'
        });
        pdfDoc.font('Times-Bold').fontSize(12).text('Total : $ ' + total + ' /-', {
          align: 'right',
        })
        pdfDoc.end();
  
        // fs.readFile(invoicePath, (err, data) => {
        //   if (err) {
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type', 'application/pdf');
        //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        //   res.send(data);
        // });
        // const file = fs.createReadStream(invoicePath);
        // file.pipe(res);
      })
      .catch(err => {
        return next(err);
      });
  };