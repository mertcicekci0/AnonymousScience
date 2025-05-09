pub fn verify_mail(
    sender: [u8; 32],
    recipient: [u8; 32],
    message: [u8; 32],
    timestamp: u64,
    expected_sender_hash: [u8; 32],
    expected_recipient_hash: [u8; 32],
    expected_message_hash: [u8; 32],
    expected_timestamp: u64,
) -> bool {
    let sender_match = sender == expected_sender_hash;
    let recipient_match = recipient == expected_recipient_hash;
    let message_match = message == expected_message_hash;
    let timestamp_match = timestamp == expected_timestamp;

    sender_match & recipient_match & message_match & timestamp_match
}
