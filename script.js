let data = JSON.parse(localStorage.getItem("tailor")) || [];

let currentOrg = "";
let currentBranch = "";
let editIndex = -1;

// ================= NAVIGATION =================
function showSection(id) {
    hideAll();
    document.getElementById(id).classList.remove("hidden");

    if (id === "saved") renderTree();
    if (id === "stats") renderStats();
}

function goHome() {
    hideAll();
    document.getElementById("home").classList.remove("hidden");
}

function hideAll() {
    document.querySelectorAll(".container").forEach(e => e.classList.add("hidden"));
}

// ================= ORGANIZATION =================
function chooseType(type) {

    let org = document.getElementById("orgName").value.trim();

    if (!org) return alert("اكتب اسم المؤسسة");

    currentOrg = org;

    hideAll();

    if (type === "branch") {
        document.getElementById("branchSection").classList.remove("hidden");
    } else {
        goToMember();
    }
}

// ================= MEMBER =================
function goToMember() {
    currentBranch = document.getElementById("branchName")?.value.trim() || "";
    hideAll();
    document.getElementById("memberSection").classList.remove("hidden");
}

// منع تكرار العميل
function isDuplicate(name) {
    return data.some(d =>
        d.name === name &&
        d.org === currentOrg &&
        d.branch === currentBranch
    );
}

// ================= SAVE =================
function saveData() {

    let name = document.getElementById("name").value.trim();
    if (!name) return alert("اكتب اسم العميل");

    if (isDuplicate(name) && editIndex === -1)
        return alert("⚠️ العميل موجود مسبقاً");

    let item = {
        org: currentOrg,
        branch: currentBranch,
        name,

        shirt_length: shirt_length.value,
        shirt_shoulder: shirt_shoulder.value,
        shirt_sleeve: shirt_sleeve.value,
        shirt_neck: shirt_neck.value,
        shirt_width: shirt_width.value,
        shirt_belly: shirt_belly.value,

        pants_length: pants_length.value,
        pants_waist: pants_waist.value,
        pants_hip: pants_hip.value,
        pants_thigh: pants_thigh.value,
        pants_knee: pants_knee.value,
        pants_bottom: pants_bottom.value,

        notes: notes.value
    };

    if (editIndex === -1) data.push(item);
    else {
        data[editIndex] = item;
        editIndex = -1;
    }

    localStorage.setItem("tailor", JSON.stringify(data));

    alert("تم الحفظ");
    goHome();
}

// عميل جديد
function saveAndNew() {
    saveData();
    clearForm();
    showSection("memberSection");
}

// فرع جديد
function addAnotherBranch() {
    clearForm();
    document.getElementById("branchName").value = "";
    hideAll();
    document.getElementById("branchSection").classList.remove("hidden");
}

// تنظيف
function clearForm() {
    document.querySelectorAll("#memberSection input").forEach(i => i.value = "");
}

// ================= TREE VIEW =================
function renderTree(filter = "") {

    let tree = document.getElementById("tree");
    tree.innerHTML = "";

    let orgs = [...new Set(data.map(d => d.org))];

    orgs.forEach(org => {

        let orgData = data.filter(d => d.org === org);
        let branches = [...new Set(orgData.map(d => d.branch || "بدون فرع"))];

        let html = `<div class="card"><h3>🏢 ${org}</h3>`;

        branches.forEach(branch => {

            let branchData = orgData.filter(d => (d.branch || "بدون فرع") === branch);

            html += `<div class="card"><h4>🏬 ${branch}</h4>`;

            branchData.forEach((c, index) => {

                if (filter && !c.name.includes(filter)) return;

                html += `
                <div class="card">
                    👤 ${c.name}
                    <br>
                    📝 ${c.notes || "لا يوجد ملاحظات"}

                    <br><br>

                    <button onclick="editData(${index})">✏ تعديل</button>
                    <button onclick="deleteData(${index})" class="danger">🗑 حذف</button>
                    <button onclick="printData(${index})" class="success">🖨 طباعة</button>
                </div>`;
            });

            html += `</div>`;
        });

        html += `</div>`;
        tree.innerHTML += html;
    });
}

// ================= DELETE =================
function deleteData(index) {
    data.splice(index, 1);
    localStorage.setItem("tailor", JSON.stringify(data));
    renderTree();
}

// ================= EDIT =================
function editData(index) {

    let c = data[index];
    editIndex = index;

    currentOrg = c.org;
    currentBranch = c.branch;

    showSection("memberSection");

    name.value = c.name;

    shirt_length.value = c.shirt_length;
    shirt_shoulder.value = c.shirt_shoulder;
    shirt_sleeve.value = c.shirt_sleeve;
    shirt_neck.value = c.shirt_neck;
    shirt_width.value = c.shirt_width;
    shirt_belly.value = c.shirt_belly;

    pants_length.value = c.pants_length;
    pants_waist.value = c.pants_waist;
    pants_hip.value = c.pants_hip;
    pants_thigh.value = c.pants_thigh;
    pants_knee.value = c.pants_knee;
    pants_bottom.value = c.pants_bottom;

    notes.value = c.notes;
}

// ================= SEARCH =================
function searchData() {
    let val = document.getElementById("search").value;
    renderTree(val);
}

// ================= STATS =================
function renderStats() {

    let orgs = new Set(data.map(d => d.org));
    let branches = new Set(data.map(d => d.branch));
    let clients = data.length;

    document.getElementById("statsBox").innerHTML = `
        <div class="card">🏢 المؤسسات: ${orgs.size}</div>
        <div class="card">🏬 الفروع: ${branches.size}</div>
        <div class="card">👤 العملاء: ${clients}</div>
    `;
}

// ================= PRINT =================
function printData(index) {

    let c = data[index];

    let win = window.open("", "", "width=800,height=600");

    win.document.write(`
        <h2>🧵 بيانات العميل</h2>
        <p>الاسم: ${c.name}</p>
        <p>المؤسسة: ${c.org}</p>
        <p>الفرع: ${c.branch}</p>
        <p>الملاحظات: ${c.notes}</p>
    `);

    win.print();
}