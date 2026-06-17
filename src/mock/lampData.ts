import type { Hall, LampPosition, RenewalRecord } from '@/types'
import { LampType, LampStatus } from '@/types'

const today = new Date()

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

export const halls: Hall[] = [
  { id: 'daxiong', name: '大雄宝殿', rows: 6, cols: 10 },
  { id: 'guanyin', name: '观音殿', rows: 5, cols: 8 },
  { id: 'caishen', name: '财神殿', rows: 4, cols: 6 }
]

const devoteeNames = [
  '陈建华', '王美玲', '李志强', '张丽华', '刘建国',
  '赵文博', '孙雅琴', '周明辉', '吴金凤', '郑海涛',
  '冯玉兰', '褚英杰', '卫晓燕', '蒋伟东', '沈明珠',
  '韩雪松', '杨春燕', '朱国平', '秦晓峰', '尤慧敏',
  '许志远', '何丽华', '吕建华', '施卫东', '张红梅',
  '孔令辉', '曹雪梅', '严志强', '华玉珍', '金建国',
  '魏文博', '陶雅琴', '姜明辉', '戚金凤', '谢海涛',
  '邹玉兰', '苏英杰', '潘晓燕', '葛伟东', '范明珠'
]

function generateRenewals(baseDate: string, count: number): RenewalRecord[] {
  const records: RenewalRecord[] = []
  let currentDate = baseDate
  for (let i = 0; i < count; i++) {
    const days = Math.floor(Math.random() * 30) + 7
    records.push({
      id: `r_${i}_${Math.random().toString(36).slice(2, 8)}`,
      date: currentDate,
      days,
      amount: days * 5,
      operator: '香灯师-释悟'
    })
    currentDate = addDays(currentDate, days)
  }
  return records
}

function generateLamps(hall: Hall): LampPosition[] {
  const lamps: LampPosition[] = []
  let lampIndex = 0
  for (let row = 0; row < hall.rows; row++) {
    for (let col = 0; col < hall.cols; col++) {
      const types = [LampType.GHEE, LampType.LOTUS, LampType.ELECTRONIC, LampType.ETERNAL]
      const type = types[Math.floor(Math.random() * types.length)]
      
      const startOffset = Math.floor(Math.random() * 60) - 30
      const startDate = addDays(formatDate(today), -startOffset)
      
      const duration = Math.floor(Math.random() * 60) + 7
      let endDate = addDays(startDate, duration)
      
      let status: LampStatus
      const daysLeft = daysBetween(formatDate(today), endDate)
      
      if (daysLeft < 0) {
        status = LampStatus.OFF
      } else if (daysLeft < 3) {
        status = LampStatus.WARNING
      } else {
        status = LampStatus.ON
      }
      
      const renewalCount = Math.floor(Math.random() * 3)
      const renewalRecords = generateRenewals(startDate, renewalCount)
      if (renewalCount > 0) {
        const lastRenewal = renewalRecords[renewalRecords.length - 1]
        endDate = addDays(lastRenewal.date, lastRenewal.days + Math.floor(Math.random() * 30))
        const newDaysLeft = daysBetween(formatDate(today), endDate)
        if (newDaysLeft < 0) {
          status = LampStatus.OFF
        } else if (newDaysLeft < 3) {
          status = LampStatus.WARNING
        }
      }
      
      lamps.push({
        id: `${hall.id}_${row}_${col}`,
        hallId: hall.id,
        row,
        col,
        type,
        status,
        devoteeName: devoteeNames[lampIndex % devoteeNames.length],
        startDate,
        endDate,
        renewalRecords
      })
      lampIndex++
    }
  }
  return lamps
}

export const lampList: LampPosition[] = [
  ...generateLamps(halls[0]),
  ...generateLamps(halls[1]),
  ...generateLamps(halls[2])
]

export function getLampsByHall(hallId: string): LampPosition[] {
  return lampList.filter(lamp => lamp.hallId === hallId)
}

export function getHallById(hallId: string): Hall | undefined {
  return halls.find(h => h.id === hallId)
}
