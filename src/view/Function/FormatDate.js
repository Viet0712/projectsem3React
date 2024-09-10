const handleDatePickerChange = (dates) => {
  const PickDate = new Date(dates); // Tạo một đối tượng Date từ dates[1]
  // Tính toán chênh lệch múi giờ (phút)
  const timezoneOffsetInMinutesEndDate = PickDate.getTimezoneOffset();

  // Điều chỉnh ngày giờ bằng cách thêm chênh lệch múi giờ vào milliseconds
  PickDate.setTime(
    PickDate.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
  );

  // Chuyển đổi thành chuỗi đại diện cho ngày giờ theo múi giờ địa phương
  const LocalPickDate = PickDate.toISOString();

  return LocalPickDate;
};

export default handleDatePickerChange;
