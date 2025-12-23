"""
Seed data for doctors, guidance articles, and FAQs
Run with: python manage.py shell < seed_complete_data.py
"""

from exercise.models import Doctor, GuidanceArticle, FAQ

# Clear existing data
print("Clearing existing data...")
Doctor.objects.all().delete()
GuidanceArticle.objects.all().delete()
FAQ.objects.all().delete()

# Seed Doctors
print("Seeding doctors...")
doctors_data = [
    {"name": "Sarah Johnson", "specialization": "Obstetrics & Gynecology", "hospital": "City Medical Center", "phone": "+1-555-0101"},
    {"name": "Michael Chen", "specialization": "Maternal-Fetal Medicine", "hospital": "University Hospital", "phone": "+1-555-0102"},
    {"name": "Emily Rodriguez", "specialization": "Obstetrics & Gynecology", "hospital": "Women's Health Clinic", "phone": "+1-555-0103"},
    {"name": "David Kumar", "specialization": "High-Risk Pregnancy", "hospital": "Regional Medical Center", "phone": "+1-555-0104"},
    {"name": "Lisa Thompson", "specialization": "Obstetrics & Gynecology", "hospital": "Community Hospital", "phone": "+1-555-0105"},
]

for doc_data in doctors_data:
    Doctor.objects.create(**doc_data)

print(f"Created {len(doctors_data)} doctors")

# Seed Guidance Articles
print("Seeding guidance articles...")
articles_data = [
    # First Trimester
    {
        "title": "First Trimester: What to Expect",
        "content": """# Welcome to Your First Trimester!

The first trimester (weeks 1-13) is a time of incredible change. Here's what you need to know:

## Physical Changes
- Morning sickness and nausea
- Fatigue and tiredness
- Breast tenderness
- Frequent urination

## Important Tips
1. **Take prenatal vitamins** - Especially folic acid (400-800 mcg daily)
2. **Stay hydrated** - Drink 8-10 glasses of water daily
3. **Rest when needed** - Your body is working hard!
4. **Eat small, frequent meals** - Helps with nausea

## What to Avoid
- Alcohol and smoking
- Raw or undercooked foods
- High-mercury fish
- Excessive caffeine (limit to 200mg/day)

## When to Call Your Doctor
- Severe abdominal pain
- Heavy bleeding
- Severe vomiting
- High fever

Remember: Every pregnancy is unique. Trust your body and don't hesitate to contact your healthcare provider with concerns.""",
        "category": "trimester",
        "trimester": 1,
        "icon": "🌱",
        "order": 1
    },
    # Second Trimester
    {
        "title": "Second Trimester: The Golden Period",
        "content": """# Second Trimester (Weeks 14-27)

Often called the "golden period" of pregnancy, you'll likely feel more energetic!

## What's Happening
- Baby bump becomes visible
- You may feel baby's first movements (quickening)
- Energy levels increase
- Morning sickness usually subsides

## Staying Healthy
1. **Continue prenatal care** - Regular checkups are crucial
2. **Stay active** - Safe exercises like walking, swimming, prenatal yoga
3. **Eat nutritious foods** - Focus on protein, calcium, iron
4. **Monitor weight gain** - Aim for 1-2 pounds per week

## Common Experiences
- Round ligament pain
- Backaches
- Leg cramps
- Skin changes (darkening, stretch marks)

## Prepare for Baby
- Start thinking about baby names
- Plan your nursery
- Consider childbirth classes
- Update your birth plan

Enjoy this special time - many women feel their best during the second trimester!""",
        "category": "trimester",
        "trimester": 2,
        "icon": "🌸",
        "order": 2
    },
    # Third Trimester
    {
        "title": "Third Trimester: Final Stretch",
        "content": """# Third Trimester (Weeks 28-40)

The home stretch! Your baby is growing rapidly and you're preparing for birth.

## Physical Changes
- Increased fatigue
- Shortness of breath
- Braxton Hicks contractions
- Swelling in feet and ankles
- Difficulty sleeping

## Getting Ready
1. **Pack your hospital bag** (by week 36)
2. **Finalize birth plan**
3. **Install car seat**
4. **Stock up on baby essentials**
5. **Prepare meals to freeze**

## Warning Signs
Call your doctor immediately if you experience:
- Regular contractions before 37 weeks
- Decreased fetal movement
- Severe headaches
- Vision changes
- Sudden swelling

## Labor Signs
- Water breaking
- Regular contractions (5-10 min apart)
- Bloody show
- Intense lower back pain

You're almost there! Stay positive and trust your body.""",
        "category": "trimester",
        "trimester": 3,
        "icon": "🌺",
        "order": 3
    },
    # Exercise Guide
    {
        "title": "Safe Exercises During Pregnancy",
        "content": """# Exercise During Pregnancy

Staying active during pregnancy has numerous benefits!

## Benefits
- Reduces back pain
- Improves mood and energy
- Helps with sleep
- Prepares body for labor
- Faster postpartum recovery

## Safe Exercises
1. **Walking** - Perfect for all trimesters
2. **Swimming** - Low-impact, full-body workout
3. **Prenatal Yoga** - Flexibility and relaxation
4. **Stationary Cycling** - Cardiovascular fitness
5. **Pelvic Floor Exercises** - Prepare for delivery

## Safety Guidelines
- Keep heart rate below 140 bpm
- Stay hydrated
- Avoid overheating
- Stop if you feel dizzy or short of breath
- Avoid contact sports and activities with fall risk

## Exercises to Avoid
- Heavy lifting
- Lying flat on back (after first trimester)
- Hot yoga or Bikram yoga
- Scuba diving
- Contact sports

Listen to your body and consult your doctor before starting any exercise program.""",
        "category": "exercise",
        "icon": "💪",
        "order": 4
    },
    # Nutrition Guide
    {
        "title": "Nutrition for a Healthy Pregnancy",
        "content": """# Eating Well During Pregnancy

Proper nutrition supports your baby's development and your health.

## Key Nutrients
1. **Folic Acid** - Prevents neural tube defects (400-800 mcg)
2. **Iron** - Prevents anemia (27 mg daily)
3. **Calcium** - Builds strong bones (1000 mg daily)
4. **Protein** - Supports growth (70-100g daily)
5. **DHA** - Brain development (200-300 mg daily)

## Healthy Foods
- **Fruits & Vegetables** - 5-7 servings daily
- **Whole Grains** - Brown rice, quinoa, oats
- **Lean Proteins** - Chicken, fish, beans, eggs
- **Dairy** - Milk, yogurt, cheese
- **Healthy Fats** - Avocado, nuts, olive oil

## Foods to Avoid
- Raw or undercooked meat/eggs
- Unpasteurized dairy
- High-mercury fish (shark, swordfish)
- Deli meats (unless heated)
- Raw sprouts

## Hydration
Drink 8-12 glasses of water daily. Signs of dehydration:
- Dark urine
- Dizziness
- Dry mouth
- Headaches

Small, frequent meals help manage nausea and maintain energy levels.""",
        "category": "nutrition",
        "icon": "🥗",
        "order": 5
    },
]

for article_data in articles_data:
    GuidanceArticle.objects.create(**article_data)

print(f"Created {len(articles_data)} guidance articles")

# Seed FAQs
print("Seeding FAQs...")
faqs_data = [
    {
        "question": "How much weight should I gain during pregnancy?",
        "answer": "Weight gain depends on your pre-pregnancy BMI. Generally: Underweight (BMI <18.5): 28-40 lbs, Normal weight (BMI 18.5-24.9): 25-35 lbs, Overweight (BMI 25-29.9): 15-25 lbs, Obese (BMI ≥30): 11-20 lbs. Your doctor will provide personalized guidance.",
        "category": "health",
        "order": 1
    },
    {
        "question": "Is it safe to exercise during pregnancy?",
        "answer": "Yes! Exercise is generally safe and beneficial during pregnancy. Aim for 150 minutes of moderate activity per week. Safe options include walking, swimming, and prenatal yoga. Always consult your doctor before starting a new exercise routine, especially if you have pregnancy complications.",
        "category": "exercise",
        "order": 2
    },
    {
        "question": "What foods should I avoid during pregnancy?",
        "answer": "Avoid: raw or undercooked meat/eggs, unpasteurized dairy, high-mercury fish (shark, swordfish, king mackerel), deli meats (unless heated to steaming), raw sprouts, and unwashed produce. Also limit caffeine to 200mg daily and avoid alcohol completely.",
        "category": "nutrition",
        "order": 3
    },
    {
        "question": "How can I manage morning sickness?",
        "answer": "Try: eating small, frequent meals; keeping crackers by your bedside; staying hydrated; avoiding strong smells; getting fresh air; trying ginger tea or candies; eating bland foods; and resting when needed. If vomiting is severe or you can't keep fluids down, contact your doctor.",
        "category": "symptoms",
        "order": 4
    },
    {
        "question": "When will I feel my baby move?",
        "answer": "First-time mothers typically feel movement between weeks 18-22. If you've been pregnant before, you might feel it as early as week 16. Initial movements feel like flutters or bubbles. By week 28, movements should be regular. Contact your doctor if you notice decreased movement.",
        "category": "general",
        "order": 5
    },
    {
        "question": "How often should I see my doctor during pregnancy?",
        "answer": "Typical schedule: Weeks 4-28: Every 4 weeks, Weeks 28-36: Every 2 weeks, Weeks 36-40: Every week. High-risk pregnancies may require more frequent visits. Never hesitate to call between appointments if you have concerns.",
        "category": "health",
        "order": 6
    },
    {
        "question": "Can I sleep on my back during pregnancy?",
        "answer": "After the first trimester, it's best to sleep on your left side. This position improves blood flow to your baby and helps your kidneys eliminate waste. Use pillows for support. If you wake up on your back, don't worry - just roll to your side.",
        "category": "health",
        "order": 7
    },
    {
        "question": "What are Braxton Hicks contractions?",
        "answer": "Braxton Hicks are 'practice' contractions that prepare your body for labor. They're usually irregular, don't increase in intensity, and stop with movement or position changes. Real labor contractions are regular, increase in intensity, and don't stop. Call your doctor if unsure.",
        "category": "symptoms",
        "order": 8
    },
]

for faq_data in faqs_data:
    FAQ.objects.create(**faq_data)

print(f"Created {len(faqs_data)} FAQs")

print("\n✅ Seed data created successfully!")
print(f"Total: {Doctor.objects.count()} doctors, {GuidanceArticle.objects.count()} articles, {FAQ.objects.count()} FAQs")
