import { execFileSync } from "child_process"
import fs from "fs"
import { addLayout } from "./layout"
import PDFDocumentWithTables from "../lib/table"
import addTable from "./table"

const title = "FRC Soccer Schedule 10/5/2021"
const footer = `ROBOTICON 2021 + NevermoreFMS | Generated on ${new Date().toLocaleString()}`
const teams = ["5276", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"]
const roundCount = 12
const teamsPerAlliance = 2
const startTimeString = "15:00:00"
const timeBetweenMatches = 8 * 60 * 1000


const startTime = new Date('1970-01-01T' + startTimeString + 'Z')

const output = execFileSync("./matchmaker/Matchmaker.exe", [
    "-t", teams.length.toString(),
    "-r", roundCount.toString(),
    "-g",
    "-a", teamsPerAlliance.toString(),
    "-s"

]).toString()

export interface Schedule {
    matches: Match[]
}

export interface Match {
    time: string
    stations: {
        [key: string]: string
    }
}

const schedule: Schedule = {
    matches: []
}

for (const matchString of output.split('\r\n').filter(s => s.length > 0)) {
    const i = matchString.indexOf(' ')
    const matchNum = parseInt(matchString.slice(0, i))
    const matchData = matchString.slice(i + 1).split(' ')

    let time = startTime
    for (let b = 1; b < matchNum; b++) {
        time = new Date(time.getTime() + timeBetweenMatches)
    }

    const match: Match = {
        time: time.toLocaleTimeString(),
        stations: {}
    }
    const alliances = ["RED", "BLUE"]
    for (let z = 0; z < alliances.length; z++) {
        const alliance = alliances[z]
        for (let x = 1; x <= teamsPerAlliance; x++) {
            const dataIndex = ((x - 1) + (z * teamsPerAlliance)) * 2
            const teamIndex = parseInt((matchData[dataIndex])) - 1
            let team = teams[teamIndex]
            if (matchData[dataIndex + 1] === "1") {
                team += '*'
            }
            match.stations[`${alliance}${x}`] = team
        }
    }
    schedule.matches.push(match)
}

const masterDoc = new PDFDocumentWithTables({
    size: "LETTER",
    margin: 0
})
masterDoc.pipe(fs.createWriteStream('master-schedule.pdf'))

addLayout(masterDoc, `${title} | master`, footer)
addTable(schedule, masterDoc, "")

masterDoc.end()

const teamsDoc = new PDFDocumentWithTables({
    size: "LETTER",
    margin: 0
})
teamsDoc.pipe(fs.createWriteStream('teams-schedule.pdf'))

for (const team of teams) {
    addLayout(teamsDoc, `${title} | Team ${team}`, footer)
    addTable(schedule, teamsDoc, team)

    teamsDoc.addPage()
}

teamsDoc.end()