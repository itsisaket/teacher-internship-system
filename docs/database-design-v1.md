# การออกแบบฐานข้อมูล Version 1

## 1. ภาพรวมความสัมพันธ์

```text
auth.users
    |
    +-- profiles
           |-- student_profile
           |-- school_memberships -- schools
           |
academic_terms -- placements -- schools
                         |-- student (profiles)
                         |-- supervisor (profiles)
                         |-- supervision_visits
                         +-- evaluations
```

## 2. ตาราง

### profiles

ข้อมูลผู้ใช้ที่เชื่อมกับ `auth.users`

| Field | Type | รายละเอียด |
| --- | --- | --- |
| id | uuid | Primary key และอ้างถึง auth.users.id |
| role | user_role | admin, student, supervisor, school |
| full_name | text | ชื่อ-นามสกุล |
| phone | text | เบอร์โทรศัพท์ |
| avatar_url | text | รูปประจำตัว |
| is_active | boolean | สถานะการใช้งาน |
| created_at | timestamptz | วันที่สร้าง |
| updated_at | timestamptz | วันที่แก้ไขล่าสุด |

### student_profiles

ข้อมูลเฉพาะของนักศึกษา โดยหนึ่งบัญชีมีข้อมูลนักศึกษาได้หนึ่งรายการ

| Field | Type | รายละเอียด |
| --- | --- | --- |
| profile_id | uuid | Primary key และอ้างถึง profiles.id |
| student_code | text | รหัสนักศึกษา ไม่ซ้ำกัน |
| program_name | text | หลักสูตรหรือสาขาวิชา |
| year_level | smallint | ชั้นปี |

### schools

| Field | Type | รายละเอียด |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | ชื่อโรงเรียน |
| address | text | ที่อยู่ |
| district | text | อำเภอ |
| province | text | จังหวัด |
| postal_code | text | รหัสไปรษณีย์ |
| contact_name | text | ผู้ประสานงาน |
| contact_phone | text | เบอร์โทรผู้ประสานงาน |
| contact_email | text | อีเมลผู้ประสานงาน |
| is_active | boolean | สถานะการใช้งาน |

### school_memberships

เชื่อมบัญชีบทบาทโรงเรียนกับโรงเรียนที่บัญชีนั้นดูแล รองรับหลายบัญชีต่อโรงเรียน

| Field | Type | รายละเอียด |
| --- | --- | --- |
| profile_id | uuid | อ้างถึง profiles.id |
| school_id | uuid | อ้างถึง schools.id |
| created_at | timestamptz | วันที่สร้าง |

Primary key ใช้คู่ `profile_id, school_id`

### academic_terms

| Field | Type | รายละเอียด |
| --- | --- | --- |
| id | uuid | Primary key |
| academic_year | integer | ปีการศึกษา |
| semester | smallint | ภาคการศึกษา |
| start_date | date | วันเริ่มต้น |
| end_date | date | วันสิ้นสุด |
| is_active | boolean | ภาคการศึกษาปัจจุบัน |

### placements

รายการจัดสรรนักศึกษาไปฝึกสอน

| Field | Type | รายละเอียด |
| --- | --- | --- |
| id | uuid | Primary key |
| term_id | uuid | อ้างถึง academic_terms.id |
| student_id | uuid | อ้างถึง profiles.id |
| school_id | uuid | อ้างถึง schools.id |
| supervisor_id | uuid | อ้างถึง profiles.id |
| start_date | date | วันเริ่มฝึกสอน |
| end_date | date | วันสิ้นสุดฝึกสอน |
| status | placement_status | pending, approved, active, completed, cancelled |
| created_by | uuid | ผู้ดูแลระบบที่สร้างรายการ |
| created_at | timestamptz | วันที่สร้าง |
| updated_at | timestamptz | วันที่แก้ไขล่าสุด |

นักศึกษาหนึ่งคนมีการจัดสรรได้หนึ่งรายการต่อหนึ่งภาคการศึกษา

### supervision_visits

| Field | Type | รายละเอียด |
| --- | --- | --- |
| id | uuid | Primary key |
| placement_id | uuid | อ้างถึง placements.id |
| supervisor_id | uuid | อ้างถึง profiles.id |
| visit_date | date | วันที่นิเทศ |
| visit_type | visit_type | onsite หรือ online |
| status | record_status | draft หรือ submitted |
| notes | text | บันทึกการนิเทศ |
| created_at | timestamptz | วันที่สร้าง |
| updated_at | timestamptz | วันที่แก้ไขล่าสุด |

### evaluations

ผลประเมินจากอาจารย์นิเทศหรือโรงเรียน

| Field | Type | รายละเอียด |
| --- | --- | --- |
| id | uuid | Primary key |
| placement_id | uuid | อ้างถึง placements.id |
| evaluator_id | uuid | อ้างถึง profiles.id |
| evaluator_type | evaluator_type | supervisor หรือ school |
| teaching_score | numeric(5,2) | คะแนนการจัดการเรียนรู้ 0-100 |
| classroom_score | numeric(5,2) | คะแนนการจัดการชั้นเรียน 0-100 |
| responsibility_score | numeric(5,2) | คะแนนความรับผิดชอบ 0-100 |
| ethics_score | numeric(5,2) | คะแนนจรรยาบรรณ 0-100 |
| comments | text | ความเห็นเพิ่มเติม |
| status | evaluation_status | draft, submitted, published |
| submitted_at | timestamptz | วันที่ส่งผลประเมิน |
| created_at | timestamptz | วันที่สร้าง |
| updated_at | timestamptz | วันที่แก้ไขล่าสุด |

หนึ่งการจัดสรรมีผลประเมินที่ส่งแล้วได้อย่างมากหนึ่งรายการต่อประเภทผู้ประเมิน

## 3. กติกาความปลอดภัย

เปิด Row Level Security (RLS) ทุกตารางใน `public` และใช้ฟังก์ชันแบบ `security definer` สำหรับตรวจบทบาทโดยไม่ทำให้ policy เรียกตัวเองซ้ำ

- Admin อ่านและจัดการข้อมูลทั้งหมด
- Student อ่านโปรไฟล์ การจัดสรร การนิเทศ และผลประเมินที่ประกาศแล้วของตน
- Supervisor อ่านการจัดสรรของนักศึกษาที่ตนรับผิดชอบ และจัดการบันทึก/ผลประเมินของตน
- School อ่านการจัดสรรของโรงเรียนที่บัญชีตนเป็นสมาชิก และจัดการผลประเมินของโรงเรียนนั้น
- ผู้ใช้ทั่วไปแก้ไขบทบาทหรือสถานะบัญชีของตนเองไม่ได้
- ห้ามใช้ Supabase service-role key ใน Browser

## 4. การคำนวณคะแนนรวม

คะแนนรวมแสดงผลเป็นค่าเฉลี่ยของคะแนนทั้งสี่ด้าน โดยคำนวณขณะอ่านข้อมูล ไม่บันทึกค่าซ้ำในฐานข้อมูล

