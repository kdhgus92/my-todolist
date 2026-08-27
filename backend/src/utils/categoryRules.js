// ponytail: DB 유니크 인덱스(lower(trim(name)))가 SoT. 이 함수는 비교 규칙의 명세/테스트 대상이자 향후 앱레벨 사전검증이 필요해질 때의 재사용 지점.
function normalizeCategoryName(name) {
  return name.trim().toLowerCase();
}

function areCategoryNamesEqual(a, b) {
  return normalizeCategoryName(a) === normalizeCategoryName(b);
}

module.exports = { normalizeCategoryName, areCategoryNamesEqual };
