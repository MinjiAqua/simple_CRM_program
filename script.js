document.addEventListener("DOMContentLoaded", function () {
    let memberData = [];

    // LocalStorage에서 데이터를 불러오기
    if (localStorage.getItem('members')) {
        memberData = JSON.parse(localStorage.getItem('members'));
        updateTable();
    }

    // 모달 창 관련 요소
    const addModal = document.getElementById("addMemberModal");
    const editModal = document.getElementById("editMemberModal");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    const closeAddModalBtn = document.getElementById("closeAddModal");
    const closeEditModalBtn = document.getElementById("closeEditModal");

    // 모달 열기
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener("click", function () {
            addModal.style.display = "block";
        });
    }

    // 모달 닫기
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener("click", function () {
            addModal.style.display = "none";
        });
    }

    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener("click", function () {
            editModal.style.display = "none";
        });
    }

    // 모달 외부 클릭 시 닫기
    window.addEventListener("click", function (event) {
        if (event.target === addModal) {
            addModal.style.display = "none";
        }
        if (event.target === editModal) {
            editModal.style.display = "none";
        }
    });

    // 회원 추가 폼 처리
    const memberForm = document.getElementById("memberForm");
    if (memberForm) {
        memberForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const newMember = {
                memberId: document.getElementById("memberId").value,
                name: document.getElementById("name").value,
                age: document.getElementById("age").value,
                birthdate: document.getElementById("birthdate").value,
                address: document.getElementById("address").value,
                paymentDate: document.getElementById("paymentDate").value,
                class: document.getElementById("class").value,
                phoneNumber: document.getElementById("phoneNumber").value,
            };

            memberData.push(newMember);
            saveToLocalStorage();
            updateTable();
            memberForm.reset();
            addModal.style.display = "none";
        });
    }

    // 회원 수정 폼 처리
    const editMemberForm = document.getElementById("editMemberForm");
    if (editMemberForm) {
        editMemberForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const updatedMember = {
                memberId: document.getElementById("editMemberId").value,
                name: document.getElementById("editName").value,
                age: document.getElementById("editAge").value,
                birthdate: document.getElementById("editBirthdate").value,
                address: document.getElementById("editAddress").value,
                paymentDate: document.getElementById("editPaymentDate").value,
                class: document.getElementById("editClass").value,
                phoneNumber: document.getElementById("editPhoneNumber").value,
            };

            const index = memberData.findIndex(member => member.memberId === updatedMember.memberId);
            if (index !== -1) {
                memberData[index] = updatedMember;
                saveToLocalStorage();
                updateTable();
            }
            editModal.style.display = "none";
        });
    }

    // LocalStorage에 데이터 저장
    function saveToLocalStorage() {
        localStorage.setItem('members', JSON.stringify(memberData));
    }

    // 테이블 업데이트
    function updateTable() {
        const tableBody = document.querySelector("#memberTable tbody");
        tableBody.innerHTML = "";

        memberData.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.memberId}</td>
                <td>${member.name}</td>
                <td>${member.age}</td>
                <td>${member.birthdate}</td>
                <td>${member.address}</td>
                <td>${member.paymentDate}</td>
                <td>${member.class}</td>
                <td>${member.phoneNumber}</td>
                <td><button class="edit-btn" data-id="${member.memberId}">수정</button></td>
                <td><button class="delete-btn" data-id="${member.memberId}">삭제</button></td>
            `;
            tableBody.appendChild(row);
        });

        // 수정 버튼 클릭 시 수정 모달 열기
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const memberId = this.getAttribute("data-id");
                const member = memberData.find(member => member.memberId === memberId);

                if (member) {
                    document.getElementById("editMemberId").value = member.memberId;
                    document.getElementById("editName").value = member.name || "";
                    document.getElementById("editAge").value = member.age || "";
                    document.getElementById("editBirthdate").value = member.birthdate || "";
                    document.getElementById("editAddress").value = member.address || "";
                    document.getElementById("editPaymentDate").value = member.paymentDate || "";
                    document.getElementById("editClass").value = member.class || "";
                    document.getElementById("editPhoneNumber").value = member.phoneNumber || "";

                    editModal.style.display = "block";
                }
            });
        });

        // 삭제 버튼 클릭 시 데이터 삭제
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const memberId = this.getAttribute("data-id");
                memberData = memberData.filter(member => member.memberId !== memberId);
                saveToLocalStorage();
                updateTable();
            });
        });
    }

    // 엑셀 다운로드 기능 (SheetJS 사용)
    document.getElementById("downloadExcel").addEventListener("click", function () {
        const ws = XLSX.utils.json_to_sheet(memberData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "회원정보");
        XLSX.writeFile(wb, "회원정보.xlsx");
    });

    // 엑셀 업로드 기능 (SheetJS 사용)
    document.getElementById("uploadExcel").addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            memberData = jsonData; // 엑셀 데이터로 교체
            saveToLocalStorage(); // LocalStorage에 저장
            updateTable(); // 테이블 업데이트
        };
        reader.readAsArrayBuffer(file);
    });
});