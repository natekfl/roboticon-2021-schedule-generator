export function addLayout(doc: PDFKit.PDFDocument, title: string, footer: string) {
    doc.font("Helvetica")
    doc.rect(0, 0, 612, 80).fill("#008033")
    doc.rect(0, 712, 612, 80).fill("#008033")
    doc.rect(0, 767, 612, 25).fill("#F7941D")
    doc.image('img/roboticon-logo.png', 0, 10, { fit: [612, 40], align: "center", valign: "center" })
    doc.image('img/roboticon-logo-mark.png', 20, 720, { height: 46 })
    doc.fillColor('white').fontSize(12).text(title, 0, 60, { width: 612, align: "center" })
    doc.fillColor('black').fontSize(8).text(footer, 20, 775)
    doc.moveTo(0, 80)
}