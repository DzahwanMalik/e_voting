# Product Requirements Document (PRD)

## E-Voting System — MVP

**Version:** 0.1.0\
**Status:** Ready

---

## 1. Product Overview

E-Voting System adalah aplikasi pemungutan suara digital dengan tiga jenis user:

- **Super Admin** — memiliki akses penuh.
- **Admin** — mengelola election yang diberikan oleh Super Admin.
- **Voter** — mengikuti election dan memberikan vote.

Sistem harus memastikan voter hanya dapat memberikan **satu vote pada satu election**.

Result hanya dapat dilihat oleh **Super Admin**.

---

## 2. User Roles

### 2.1 Super Admin

Super Admin memiliki akses penuh terhadap sistem.

Dapat:

- mengelola user;
- membuat dan mengelola election;
- mengelola candidate pada seluruh election;
- mengelola voter pada seluruh election;
- menentukan Admin yang dapat mengelola election;
- melihat result.

Super Admin dibuat melalui **seed** dan sistem hanya memiliki **satu Super Admin**.

---

### 2.2 Admin

Admin hanya dapat mengakses election yang diberikan oleh Super Admin.

Dapat:

- melihat election yang diberikan;
- mengelola candidate pada election tersebut;
- mengelola voter pada election tersebut;
- membuat Voter.

Tidak dapat:

- mengakses election yang tidak diberikan;
- menentukan assignment Admin;
- melihat result.

Admin dibuat oleh Super Admin.

---

### 2.3 Voter

Voter dapat:

- login;
- melihat election yang diikutinya;
- melihat candidate;
- memberikan vote;
- melihat status voting.

Voter tidak dapat:

- mengelola election;
- mengelola candidate;
- mengelola voter;
- melihat result.

Voter dapat dibuat oleh:

- Super Admin;
- Admin.

Jika Voter dibuat oleh Admin, scope election Voter tersebut mengikuti election yang dikelola oleh Admin yang membuatnya.

---

## 3. Election

Election merepresentasikan satu pemilihan.

Setiap election memiliki:

- title;
- description;
- candidate;
- voter;
- Admin yang ditugaskan.

Hanya **Super Admin** yang dapat membuat election.

Super Admin dapat mengelola seluruh election.

Admin hanya dapat mengelola election yang diberikan kepadanya.

Jika election dihapus, election tersebut tidak lagi dapat diakses oleh voter maupun Admin yang sebelumnya memiliki akses terhadap election tersebut.

---

## 4. Admin Assignment

Super Admin menentukan Admin yang dapat mengelola suatu election.

Satu election dapat memiliki **banyak Admin**.

Contoh:

```text
Election A
├── Admin 1
└── Admin 2

Election B
└── Admin 2
```

Artinya:

- Admin 1 hanya dapat mengelola Election A.
- Admin 2 dapat mengelola Election A dan B.

Admin tidak dapat:

- memberikan akses kepada dirinya sendiri;
- memberikan akses kepada Admin lain;
- mengubah assignment.

Assignment hanya dapat dilakukan oleh Super Admin.

---

## 5. Candidate

Candidate merupakan pilihan dalam suatu election.

Setiap candidate:

- hanya dimiliki oleh satu election;
- memiliki nama;
- memiliki informasi/deskripsi.

Candidate dapat dibuat oleh:

- Super Admin pada election mana pun;
- Admin pada election yang diberikan kepadanya.

Candidate dapat diubah oleh Super Admin atau Admin yang memiliki akses terhadap election tersebut.

Candidate juga dapat dihapus oleh Super Admin atau Admin yang memiliki akses terhadap election tersebut.

Jika candidate yang sudah memiliki vote dihapus:

- vote yang terkait dengan candidate tersebut tidak lagi menjadi bagian dari result;
- status `hasVoted` voter pada election tersebut menjadi `false`;
- voter dapat melakukan voting kembali pada election tersebut.

Jika candidate hanya diubah, vote yang sudah ada tetap berlaku.

Voter hanya dapat memilih candidate yang berasal dari election tersebut.

---

## 6. Voter Eligibility

Voter harus terdaftar pada election sebelum dapat melakukan voting.

Contoh:

```text
Election A
├── User 1
├── User 2
└── User 3

Election B
├── User 2
└── User 4
```

User 1 hanya dapat mengikuti Election A.

User 2 dapat mengikuti Election A dan B.

Eligibility berlaku per election.

### Voter yang dibuat oleh Super Admin

Jika Voter dibuat oleh Super Admin, Super Admin dapat mendaftarkan Voter pada election mana pun.

### Voter yang dibuat oleh Admin

Jika Voter dibuat oleh Admin:

- Voter hanya dapat memiliki akses ke election yang dikelola oleh Admin yang membuatnya;
- Admin hanya dapat mendaftarkan Voter pada election yang menjadi tanggung jawab Admin tersebut;
- Voter tidak dapat memperoleh akses ke election di luar scope Admin yang membuatnya.

Contoh:

```text
Admin 1
├── Election A
└── Election B

Admin 2
└── Election C
```

Jika Admin 1 membuat Voter:

```text
Voter X
├── Election A
└── Election B
```

Voter X tidak dapat mengakses:

```text
Election C
```

Jika Admin 2 membuat Voter:

```text
Voter Y
└── Election C
```

Voter Y tidak dapat mengakses:

```text
Election A
Election B
```

Voter dapat dihapus dari election oleh Super Admin atau Admin yang memiliki akses terhadap election tersebut.

Jika voter dihapus setelah melakukan vote:

- vote yang sudah tercatat tetap ada;
- vote tersebut tetap dihitung pada candidate.

---

## 7. Voting

Voter dapat memberikan satu vote kepada satu candidate dalam election yang diikutinya.

Vote hanya dapat dilakukan apabila:

- user sudah login;
- user adalah Voter;
- user terdaftar pada election;
- candidate merupakan bagian dari election;
- user belum pernah vote pada election tersebut.

Setelah vote berhasil, voter tidak dapat melakukan vote lagi pada election yang sama.

---

## 8. Vote Consistency

Ketika vote berhasil, sistem harus memastikan:

```text
Vote tercatat
+
Voter ditandai sudah voting
```

keduanya berhasil secara konsisten.

Tidak boleh terjadi:

```text
Vote tercatat
tetapi voter masih dapat voting
```

atau:

```text
Voter dianggap sudah voting
tetapi vote tidak tercatat
```

Jika candidate dihapus, status voting voter pada election tersebut dikembalikan menjadi:

```text
hasVoted = false
```

sehingga voter dapat memilih candidate lain.

---

## 9. Result

Result berisi jumlah vote setiap candidate dalam suatu election.

Contoh:

```text
Candidate A → 40 votes
Candidate B → 35 votes
Candidate C → 25 votes
```

Hanya **Super Admin** yang dapat melihat result.

```text
Super Admin → Allowed
Admin       → Forbidden
Voter       → Forbidden
```

---

## 10. Authentication & Authorization

User login menggunakan:

```text
username
password
```

Akses ditentukan berdasarkan:

```text
Role
 +
Election Assignment
 +
Voter Eligibility
 +
Voter Creator Scope
```

Backend harus memastikan user hanya dapat melakukan operasi yang memang menjadi haknya.

Frontend tidak menjadi sumber kebenaran untuk authorization.

---

## 11. Core Business Rules

### BR-01 — Role Access

User hanya dapat melakukan operasi sesuai role.

### BR-02 — Single Super Admin

Sistem hanya memiliki satu Super Admin.

### BR-03 — Super Admin Access

Super Admin memiliki akses penuh terhadap sistem.

### BR-04 — Election Creation

Hanya Super Admin yang dapat membuat election.

### BR-05 — Admin Election Scope

Admin hanya dapat mengakses election yang diberikan kepadanya oleh Super Admin.

### BR-06 — Admin Assignment

Hanya Super Admin yang dapat menentukan atau mengubah Admin assignment.

### BR-07 — Voter Eligibility

Voter hanya dapat melakukan voting pada election yang diikutinya.

### BR-08 — Admin Voter Scope

Jika Voter dibuat oleh Admin, Voter hanya dapat memiliki akses ke election yang dikelola oleh Admin yang membuatnya.

### BR-09 — Candidate Ownership

Candidate yang dipilih harus berasal dari election yang sedang diikuti.

### BR-10 — One Vote Per Election

Voter hanya dapat melakukan satu vote pada satu election.

### BR-11 — Vote Consistency

Vote dan status voting voter harus selalu konsisten.

### BR-12 — Result Access

Hanya Super Admin yang dapat melihat result.

### BR-13 — Election Isolation

Data dari satu election tidak boleh digunakan untuk election lain.

### BR-14 — Candidate Deletion

Candidate dapat dihapus meskipun sudah memiliki vote.

Ketika candidate dihapus:

- vote candidate tersebut ikut dihapus dari result;
- `hasVoted` voter pada election tersebut dikembalikan menjadi `false`.

### BR-15 — Candidate Update

Candidate dapat diubah meskipun sudah memiliki vote.

Vote yang sudah ada tetap berlaku.

### BR-16 — Voter Removal

Voter dapat dihapus dari election meskipun sudah melakukan vote.

Vote yang sudah tercatat tetap berlaku.

### BR-17 — Election Deletion

Election dapat dihapus meskipun sudah memiliki vote.

Setelah election dihapus, election tersebut tidak lagi dapat diakses oleh voter maupun Admin yang sebelumnya memiliki akses.

---

## 12. Data Relationships

Secara konseptual:

```text
User
 ├── ElectionVoter ── Election
 │                       │
 │                       └── Candidate
 │                              │
 │                              └── Vote
 │
 └── Role

Admin
 └── ElectionAdmin ── Election
```

Hubungan utama:

- User dapat mengikuti banyak election.
- Election dapat memiliki banyak voter.
- Election dapat memiliki banyak candidate.
- Candidate dapat memiliki banyak vote.
- Admin dapat mengelola banyak election.
- Election dapat memiliki banyak Admin.

Scope Voter yang dibuat oleh Admin ditentukan berdasarkan election yang dikelola oleh Admin tersebut.

---

## 13. User Creation

User dibuat melalui mekanisme berikut:

```text
Super Admin
→ dibuat melalui seed

Admin
→ dibuat oleh Super Admin

Voter
→ dibuat oleh Super Admin
   atau
   dibuat oleh Admin
```

Aturan pembuatan Voter:

```text
Super Admin
→ dapat membuat Voter dengan akses ke election yang ditentukan

Admin
→ dapat membuat Voter
→ Voter hanya memiliki akses pada election
  yang dikelola oleh Admin tersebut
```

Tidak terdapat user registration mandiri dalam MVP.

---

## 14. MVP Acceptance Criteria

### Authentication

- Super Admin dapat login.
- Admin dapat login.
- Voter dapat login.

### Admin Access

- Super Admin dapat mengelola seluruh election.
- Super Admin dapat menentukan Admin untuk election.
- Admin hanya dapat mengakses election yang diberikan kepadanya.
- Admin tidak dapat mengakses election lain.
- Admin tidak dapat mengubah assignment.

### Election Management

- Hanya Super Admin yang dapat membuat election.
- Super Admin dapat mengelola seluruh election.
- Admin dapat mengelola election yang diberikan kepadanya.
- Election dapat dihapus meskipun sudah memiliki vote.
- Setelah election dihapus, election tersebut tidak dapat diakses lagi.

### Candidate Management

- Super Admin dapat membuat candidate pada seluruh election.
- Admin dapat membuat candidate pada election yang diberikan kepadanya.
- Candidate dapat diubah.
- Candidate dapat dihapus meskipun sudah memiliki vote.
- Jika candidate dihapus, `hasVoted` voter pada election tersebut menjadi `false`.
- Vote pada candidate yang dihapus tidak lagi dihitung dalam result.

### Voter Management

- Super Admin dapat membuat dan mendaftarkan voter pada election mana pun.
- Admin dapat membuat voter.
- Voter yang dibuat oleh Admin hanya dapat mengakses election yang dikelola oleh Admin tersebut.
- Admin hanya dapat mendaftarkan voter pada election yang menjadi tanggung jawabnya.
- Voter dapat dihapus dari election.
- Jika voter dihapus setelah melakukan vote, vote yang sudah tercatat tetap berlaku.

### Voting

- Voter hanya melihat election yang menjadi bagian dari scope aksesnya.
- Voter dapat melihat candidate.
- Voter dapat melakukan vote.
- Voter hanya dapat vote satu kali pada satu election.
- Voter tidak dapat memilih candidate dari election lain.
- Vote dan status voting tetap konsisten.

### Result

- Super Admin dapat melihat result.
- Admin tidak dapat melihat result.
- Voter tidak dapat melihat result.

### Authorization

- Authorization diterapkan berdasarkan role.
- Authorization Admin mempertimbangkan election assignment.
- Authorization Voter mempertimbangkan election eligibility.
- Voter yang dibuat oleh Admin tidak dapat mengakses election di luar scope Admin yang membuatnya.
---

## 15. Business Capability

Business Capability adalah kemampuan bisnis inti yang harus dimiliki oleh sistem untuk memenuhi kebutuhan stakeholder.

### Capability Map

```text
E-Voting System
├── 1. Identity & Access Management
│   ├── Authentication
│   ├── Role-Based Authorization
│   └── Scope-Based Access Control
│
├── 2. Election Management
│   ├── Election Lifecycle
│   └── Admin Assignment
│
├── 3. Candidate Management
│   ├── Candidate Lifecycle
│   └── Vote Cascade on Deletion
│
├── 4. Voter Management
│   ├── Voter Registration
│   ├── Election Eligibility
│   └── Creator Scope Enforcement
│
├── 5. Voting
│   ├── Vote Casting
│   ├── Vote Consistency
│   └── One-Vote-Per-Election Guard
│
└── 6. Result Management
    ├── Vote Aggregation
    └── Restricted Result Access
```

---

### 15.1 Identity & Access Management

Kemampuan sistem untuk mengidentifikasi, mengotentikasi, dan mengotorisasi pengguna berdasarkan peran dan cakupan aksesnya.

**Authentication**

Sistem mampu memverifikasi identitas user melalui username dan password. Tidak ada self-registration; seluruh user dibuat oleh entitas yang berwenang.

Terkait: BR-01.

**Role-Based Authorization**

Sistem mampu membatasi akses berdasarkan tiga role:

- Super Admin — akses penuh.
- Admin — akses terbatas pada election yang diberikan.
- Voter — hanya vote dan lihat status.

Terkait: BR-01, BR-02, BR-03.

**Scope-Based Access Control**

Sistem mampu membatasi akses Admin berdasarkan election assignment, dan akses Voter berdasarkan election eligibility serta scope creator-nya.

Terkait: BR-05, BR-07, BR-08.

Authorization harus ditegakkan di backend. Frontend bukan sumber kebenaran.

---

### 15.2 Election Management

Kemampuan sistem untuk mengelola siklus hidup pemilihan dan penugasan admin.

**Election Lifecycle**

Sistem mampu membuat, mengubah, dan menghapus election. Hanya Super Admin yang dapat membuat election. Election yang dihapus tidak lagi dapat diakses oleh siapa pun.

Terkait: BR-04, BR-17.

**Admin Assignment**

Sistem mampu menugaskan satu atau lebih Admin untuk mengelola election tertentu. Hanya Super Admin yang dapat membuat atau mengubah assignment. Admin tidak dapat mengubah assignment-nya sendiri maupun Admin lain.

Terkait: BR-05, BR-06.

---

### 15.3 Candidate Management

Kemampuan sistem untuk mengelola kandidat dalam suatu election beserta dampak kaskasinya.

**Candidate Lifecycle**

Sistem mampu membuat, mengubah, dan menghapus candidate dalam election. Super Admin dapat mengelola candidate di semua election; Admin hanya pada election yang diberikan. Candidate hanya dimiliki satu election.

Terkait: BR-09, BR-13, BR-15.

**Vote Cascade on Deletion**

Ketika candidate dihapus:

- vote terkait dengan candidate tersebut dihapus dari result;
- `hasVoted` voter pada election tersebut direset menjadi `false`;
- voter dapat melakukan voting kembali pada election tersebut.

Perubahan pada candidate (update) tidak mempengaruhi vote yang sudah ada.

Terkait: BR-14, BR-15.

Penghapusan candidate adalah operasi destruktif yang me-reset status voting voter terkait. Harus dijalankan dalam transaksi atomik.

---

### 15.4 Voter Management

Kemampuan sistem untuk mengelola registrasi voter, kelayakan mengikuti election, dan pembatasan scope berdasarkan creator.

**Voter Registration**

Sistem mampu membuat user Voter. Voter dibuat oleh Super Admin atau Admin. Tidak ada self-registration.

**Election Eligibility**

Sistem mampu mendaftarkan dan menghapus voter dari election tertentu. Voter harus terdaftar pada election sebelum dapat voting. Jika voter dihapus setelah vote, vote yang sudah tercatat tetap berlaku.

Terkait: BR-07, BR-16.

**Creator Scope Enforcement**

Jika Voter dibuat oleh Admin, Voter hanya dapat mengakses election yang dikelola oleh Admin pembuat. Admin hanya dapat mendaftarkan Voter pada election yang menjadi tanggung jawabnya. Super Admin tidak memiliki batasan ini.

Terkait: BR-08.

---

### 15.5 Voting

Kemampuan sistem untuk memfasilitasi proses pemungutan suara yang aman, konsisten, dan berintegritas.

**Vote Casting**

Voter dapat memberikan satu vote kepada satu candidate dalam election yang diikutinya.

Prasyarat:

- user sudah login;
- user adalah Voter;
- user terdaftar pada election;
- candidate merupakan bagian dari election;
- user belum pernah vote pada election tersebut.

Terkait: BR-07, BR-09, BR-10.

**Vote Consistency**

Vote tercatat dan status `hasVoted` voter harus selalu konsisten.

Tidak boleh terjadi:

- vote tercatat tetapi voter masih dapat voting;
- voter dianggap sudah voting tetapi vote tidak tercatat.

Implementasi harus menggunakan database transaction untuk memastikan atomicity.

Terkait: BR-11.

**One-Vote-Per-Election Guard**

Setelah vote berhasil, voter tidak dapat vote lagi pada election yang sama. Guard ini direset hanya jika candidate yang dipilih dihapus.

Terkait: BR-10, BR-14.

---

### 15.6 Result Management

Kemampuan sistem untuk mengagregasi dan menyajikan hasil pemungutan suara dengan akses yang terbatas.

**Vote Aggregation**

Sistem mampu menghitung jumlah vote per candidate dalam suatu election. Vote dari candidate yang telah dihapus tidak dihitung dalam result.

Terkait: BR-14.

**Restricted Result Access**

Hanya Super Admin yang dapat melihat result.

```text
Super Admin → Allowed
Admin       → Forbidden
Voter       → Forbidden
```

Terkait: BR-12.

---

### 15.7 Cross-Cutting Concerns

Aspek-aspek yang menjangkau seluruh capability:

**Election Isolation**

Data dari satu election tidak boleh digunakan atau bocor ke election lain. Voter tidak bisa memilih candidate dari election lain.

Terkait: BR-13.

**Single Super Admin**

Sistem hanya memiliki tepat satu Super Admin, dibuat melalui seed.

Terkait: BR-02.

**Backend-Enforced Authorization**

Seluruh aturan otorisasi ditegakkan di backend. Frontend hanya bersifat UX helper.

**Transactional Integrity**

Operasi yang melibatkan multiple state changes (vote, candidate deletion) harus bersifat atomik.

Terkait: BR-11, BR-14.

---

### Capability — Business Rule Traceability

```text
Capability                  BR-01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17
─────────────────────────── ───── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
Authentication                ●
Role-Based AuthZ              ●    ●  ●
Scope-Based AC                            ●        ●  ●
Election Lifecycle                        ●                                     ●
Admin Assignment                          ●  ●
Candidate Lifecycle                                   ●              ●     ●
Vote Cascade                                                         ●     ●
Voter Registration
Election Eligibility                            ●                             ●
Creator Scope                                      ●
Vote Casting                                   ●     ●  ●
Vote Consistency                                              ●
One-Vote Guard                                        ●           ●
Vote Aggregation                                                  ●
Result Access                                                ●
```
