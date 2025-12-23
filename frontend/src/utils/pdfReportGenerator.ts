import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface WeeklyReportData {
    week_start: string
    week_end: string
    activity_summary: {
        total_steps: number
        total_calories: number
        avg_heart_rate: number
        total_sleep_hours: number
    }
    exercise_summary: {
        total_sessions: number
        total_reps: number
        avg_posture_score: number
        exercises: Array<{ exercise_type: string; count: number }>
    }
    daily_data: Array<{
        date: string
        steps: number
        calories: number
        heart_rate?: number
        sleep_hours?: number
    }>
    recommendations: string[]
}

export function generatePDFReport(reportData: WeeklyReportData) {
    const doc = new jsPDF()
    let yPos = 20

    // Title Page
    doc.setFillColor(139, 92, 246) // Purple
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Weekly Health Report', 105, 20, { align: 'center' })

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('AI-Powered Pregnancy Care', 105, 30, { align: 'center' })

    // Report Period
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    yPos = 55
    doc.setFont('helvetica', 'bold')
    doc.text('Report Period:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${formatDate(reportData.week_start)} - ${formatDate(reportData.week_end)}`, 60, yPos)

    // Executive Summary
    yPos += 15
    addSectionHeader(doc, 'Executive Summary', yPos)
    yPos += 10

    const summary = generateExecutiveSummary(reportData)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const summaryLines = doc.splitTextToSize(summary, 170)
    doc.text(summaryLines, 20, yPos)
    yPos += summaryLines.length * 5 + 10

    // Activity Summary Section
    if (yPos > 250) {
        doc.addPage()
        yPos = 20
    }

    addSectionHeader(doc, 'Activity Summary', yPos)
    yPos += 10

    const activityData = [
        ['Metric', 'Value', 'Status', 'Analysis'],
        [
            'Total Steps',
            reportData.activity_summary.total_steps.toLocaleString(),
            getStepsStatus(reportData.activity_summary.total_steps),
            getStepsAnalysis(reportData.activity_summary.total_steps)
        ],
        [
            'Total Calories',
            reportData.activity_summary.total_calories.toLocaleString() + ' kcal',
            getCaloriesStatus(reportData.activity_summary.total_calories),
            getCaloriesAnalysis(reportData.activity_summary.total_calories)
        ],
        [
            'Avg Heart Rate',
            Math.round(reportData.activity_summary.avg_heart_rate) + ' bpm',
            getHeartRateStatus(reportData.activity_summary.avg_heart_rate),
            getHeartRateAnalysis(reportData.activity_summary.avg_heart_rate)
        ],
        [
            'Total Sleep',
            reportData.activity_summary.total_sleep_hours.toFixed(1) + ' hrs',
            getSleepStatus(reportData.activity_summary.total_sleep_hours),
            getSleepAnalysis(reportData.activity_summary.total_sleep_hours)
        ]
    ]

    autoTable(doc, {
        startY: yPos,
        head: [activityData[0]],
        body: activityData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246], textColor: 255 },
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 80 }
        },
        styles: { fontSize: 9 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Exercise Summary Section
    if (yPos > 230) {
        doc.addPage()
        yPos = 20
    }

    addSectionHeader(doc, 'Exercise Performance', yPos)
    yPos += 10

    const exerciseData = [
        ['Metric', 'Value', 'Weekly Goal', 'Achievement'],
        [
            'Total Sessions',
            reportData.exercise_summary.total_sessions.toString(),
            '10-14 sessions',
            getSessionsAchievement(reportData.exercise_summary.total_sessions)
        ],
        [
            'Total Reps',
            reportData.exercise_summary.total_reps.toString(),
            '200+ reps',
            getRepsAchievement(reportData.exercise_summary.total_reps)
        ],
        [
            'Avg Posture Score',
            Math.round(reportData.exercise_summary.avg_posture_score) + '%',
            '80%+',
            getPostureAchievement(reportData.exercise_summary.avg_posture_score)
        ]
    ]

    autoTable(doc, {
        startY: yPos,
        head: [exerciseData[0]],
        body: exerciseData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 9 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Exercise Distribution
    if (reportData.exercise_summary.exercises.length > 0) {
        if (yPos > 230) {
            doc.addPage()
            yPos = 20
        }

        addSectionHeader(doc, 'Exercise Distribution', yPos)
        yPos += 10

        const exerciseDistData = [
            ['Exercise Type', 'Count', 'Percentage'],
            ...reportData.exercise_summary.exercises.map(ex => {
                const total = reportData.exercise_summary.exercises.reduce((sum, e) => sum + e.count, 0)
                const percentage = ((ex.count / total) * 100).toFixed(1)
                return [ex.exercise_type, ex.count.toString(), percentage + '%']
            })
        ]

        autoTable(doc, {
            startY: yPos,
            head: [exerciseDistData[0]],
            body: exerciseDistData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            styles: { fontSize: 9 }
        })

        yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // Daily Activity Trends
    doc.addPage()
    yPos = 20

    addSectionHeader(doc, 'Daily Activity Trends', yPos)
    yPos += 10

    const dailyData = [
        ['Date', 'Steps', 'Calories', 'Heart Rate', 'Sleep (hrs)'],
        ...reportData.daily_data.map(day => [
            formatDate(day.date),
            day.steps.toLocaleString(),
            day.calories.toLocaleString(),
            day.heart_rate ? day.heart_rate + ' bpm' : 'N/A',
            day.sleep_hours ? day.sleep_hours.toFixed(1) : 'N/A'
        ])
    ]

    autoTable(doc, {
        startY: yPos,
        head: [dailyData[0]],
        body: dailyData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [236, 72, 153], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 30 }
        }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Detailed Analysis
    if (yPos > 230) {
        doc.addPage()
        yPos = 20
    }

    addSectionHeader(doc, 'Detailed Health Analysis', yPos)
    yPos += 10

    const analysis = generateDetailedAnalysis(reportData)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    analysis.forEach(section => {
        if (yPos > 260) {
            doc.addPage()
            yPos = 20
        }

        doc.setFont('helvetica', 'bold')
        doc.text(section.title, 20, yPos)
        yPos += 7

        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(section.content, 170)
        doc.text(lines, 20, yPos)
        yPos += lines.length * 5 + 8
    })

    // Health Recommendations
    if (reportData.recommendations.length > 0) {
        if (yPos > 230) {
            doc.addPage()
            yPos = 20
        }

        addSectionHeader(doc, 'Personalized Health Recommendations', yPos)
        yPos += 10

        doc.setFontSize(10)
        reportData.recommendations.forEach((rec, idx) => {
            if (yPos > 270) {
                doc.addPage()
                yPos = 20
            }

            doc.setFont('helvetica', 'bold')
            doc.text(`${idx + 1}.`, 20, yPos)
            doc.setFont('helvetica', 'normal')
            const recLines = doc.splitTextToSize(rec, 165)
            doc.text(recLines, 27, yPos)
            yPos += recLines.length * 5 + 5
        })
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
            `AI-Powered Pregnancy Care - Page ${i} of ${pageCount}`,
            105,
            290,
            { align: 'center' }
        )
        doc.text(
            `Generated on ${new Date().toLocaleDateString()}`,
            105,
            285,
            { align: 'center' }
        )
    }

    // Save PDF
    const filename = `weekly-health-report-${reportData.week_start}-to-${reportData.week_end}.pdf`
    doc.save(filename)
}

function addSectionHeader(doc: jsPDF, title: string, yPos: number) {
    doc.setFillColor(243, 244, 246)
    doc.rect(15, yPos - 5, 180, 10, 'F')
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(31, 41, 55)
    doc.text(title, 20, yPos + 2)
    doc.setTextColor(0, 0, 0)
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function generateExecutiveSummary(data: WeeklyReportData): string {
    const avgStepsPerDay = Math.round(data.activity_summary.total_steps / 7)
    const avgSleepPerDay = (data.activity_summary.total_sleep_hours / 7).toFixed(1)

    return `This week's health report shows ${data.activity_summary.total_sessions} exercise sessions with an average posture score of ${Math.round(data.exercise_summary.avg_posture_score)}%. You achieved ${data.activity_summary.total_steps.toLocaleString()} total steps (avg ${avgStepsPerDay.toLocaleString()}/day) and burned ${data.activity_summary.total_calories.toLocaleString()} calories. Your average heart rate was ${Math.round(data.activity_summary.avg_heart_rate)} bpm, and you averaged ${avgSleepPerDay} hours of sleep per night. Overall, your activity levels are ${getOverallStatus(data)} for a healthy pregnancy.`
}

function generateDetailedAnalysis(data: WeeklyReportData): Array<{ title: string; content: string }> {
    const analysis = []

    // Activity Analysis
    const avgSteps = data.activity_summary.total_steps / 7
    analysis.push({
        title: '📊 Activity Level Analysis',
        content: `Your average daily step count of ${Math.round(avgSteps).toLocaleString()} steps ${avgSteps >= 6000 ? 'exceeds' : 'is below'} the recommended 6,000-8,000 steps for pregnant women. ${avgSteps >= 6000 ? 'Excellent work maintaining an active lifestyle!' : 'Consider gradually increasing your daily movement through short walks.'} Regular physical activity during pregnancy helps maintain healthy weight gain, reduces back pain, and improves mood.`
    })

    // Sleep Analysis
    const avgSleep = data.activity_summary.total_sleep_hours / 7
    analysis.push({
        title: '😴 Sleep Quality Analysis',
        content: `You averaged ${avgSleep.toFixed(1)} hours of sleep per night. ${avgSleep >= 7 ? 'This meets' : 'This falls short of'} the recommended 7-9 hours for pregnant women. ${avgSleep < 7 ? 'Adequate sleep is crucial for fetal development and your recovery. Try establishing a consistent bedtime routine and limiting screen time before bed.' : 'Great job prioritizing rest! Quality sleep supports your immune system and helps manage pregnancy-related fatigue.'}`
    })

    // Exercise Analysis
    analysis.push({
        title: '💪 Exercise Performance Analysis',
        content: `You completed ${data.exercise_summary.total_sessions} exercise sessions this week with an average posture score of ${Math.round(data.exercise_summary.avg_posture_score)}%. ${data.exercise_summary.avg_posture_score >= 80 ? 'Your excellent form reduces injury risk and maximizes benefits.' : 'Focus on maintaining proper form to prevent strain and ensure safety.'} ${data.exercise_summary.total_sessions >= 10 ? 'You\'re meeting the recommended 10-14 sessions per week.' : 'Aim for 10-14 sessions weekly for optimal pregnancy fitness.'}`
    })

    // Heart Rate Analysis
    const avgHR = data.activity_summary.avg_heart_rate
    analysis.push({
        title: '❤️ Cardiovascular Health',
        content: `Your average heart rate of ${Math.round(avgHR)} bpm is ${avgHR <= 140 ? 'within the safe range' : 'slightly elevated'}. During pregnancy, aim to keep your heart rate below 140 bpm during exercise. ${avgHR <= 140 ? 'Continue monitoring your intensity and stay hydrated.' : 'Consider reducing exercise intensity and consult your healthcare provider if this persists.'}`
    })

    return analysis
}

function getStepsStatus(steps: number): string {
    const daily = steps / 7
    if (daily >= 8000) return '✅ Excellent'
    if (daily >= 6000) return '✓ Good'
    if (daily >= 4000) return '⚠ Fair'
    return '❌ Low'
}

function getStepsAnalysis(steps: number): string {
    const daily = steps / 7
    if (daily >= 8000) return 'Exceeding daily goals'
    if (daily >= 6000) return 'Meeting recommendations'
    if (daily >= 4000) return 'Below target, increase gradually'
    return 'Significantly low, consult doctor'
}

function getCaloriesStatus(calories: number): string {
    const daily = calories / 7
    if (daily >= 2200) return '✅ Adequate'
    if (daily >= 1800) return '✓ Moderate'
    return '⚠ Low'
}

function getCaloriesAnalysis(calories: number): string {
    const daily = calories / 7
    if (daily >= 2200) return 'Supporting healthy metabolism'
    if (daily >= 1800) return 'Moderate activity level'
    return 'May need increased activity'
}

function getHeartRateStatus(hr: number): string {
    if (hr <= 120) return '✅ Optimal'
    if (hr <= 140) return '✓ Safe'
    return '⚠ Monitor'
}

function getHeartRateAnalysis(hr: number): string {
    if (hr <= 120) return 'Ideal pregnancy range'
    if (hr <= 140) return 'Within safe limits'
    return 'Consider reducing intensity'
}

function getSleepStatus(hours: number): string {
    const daily = hours / 7
    if (daily >= 8) return '✅ Excellent'
    if (daily >= 7) return '✓ Good'
    if (daily >= 6) return '⚠ Fair'
    return '❌ Insufficient'
}

function getSleepAnalysis(hours: number): string {
    const daily = hours / 7
    if (daily >= 8) return 'Optimal rest for pregnancy'
    if (daily >= 7) return 'Meeting minimum requirements'
    if (daily >= 6) return 'Increase sleep duration'
    return 'Critical - prioritize rest'
}

function getSessionsAchievement(sessions: number): string {
    if (sessions >= 14) return '🌟 Exceeding (100%+)'
    if (sessions >= 10) return '✅ Achieved (71-100%)'
    if (sessions >= 7) return '✓ Good (50-70%)'
    return '⚠ Below Target (<50%)'
}

function getRepsAchievement(reps: number): string {
    if (reps >= 250) return '🌟 Exceeding (125%+)'
    if (reps >= 200) return '✅ Achieved (100%+)'
    if (reps >= 150) return '✓ Good (75-99%)'
    return '⚠ Below Target (<75%)'
}

function getPostureAchievement(score: number): string {
    if (score >= 90) return '🌟 Excellent (90%+)'
    if (score >= 80) return '✅ Good (80-89%)'
    if (score >= 70) return '✓ Fair (70-79%)'
    return '⚠ Needs Improvement (<70%)'
}

function getOverallStatus(data: WeeklyReportData): string {
    let score = 0

    // Steps
    const avgSteps = data.activity_summary.total_steps / 7
    if (avgSteps >= 6000) score += 25
    else if (avgSteps >= 4000) score += 15

    // Sleep
    const avgSleep = data.activity_summary.total_sleep_hours / 7
    if (avgSleep >= 7) score += 25
    else if (avgSleep >= 6) score += 15

    // Exercise
    if (data.exercise_summary.total_sessions >= 10) score += 25
    else if (data.exercise_summary.total_sessions >= 7) score += 15

    // Posture
    if (data.exercise_summary.avg_posture_score >= 80) score += 25
    else if (data.exercise_summary.avg_posture_score >= 70) score += 15

    if (score >= 85) return 'excellent'
    if (score >= 65) return 'very good'
    if (score >= 45) return 'good'
    return 'fair'
}
