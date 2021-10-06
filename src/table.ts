import { Schedule } from "."
import PDFDocumentWithTables from "../lib/table"

export default function addTable(schedule: Schedule, doc: PDFDocumentWithTables, highlightTeam: string) {
    const table = {
        headers: [
            { label: "Time", property: "time" },
            ...Object.keys(schedule.matches[0].stations).map(s => ({ label: s, property: s }))
        ],
        datas: schedule.matches.map(m => ({ time: m.time, ...m.stations })),
    }

    doc.fontSize(30).table(table, {
        width: 572,
        x: 20,
        y: 110,
        prepareRow: (row, indexColumn, indexRow, rectRow) => {
            if (Object.values(row).map(t => (t as any).replace("*", "")).includes(highlightTeam)) {
                indexColumn === 0 && doc.addBackground(rectRow, 'green', 0.5)
            }
        }
    })
}