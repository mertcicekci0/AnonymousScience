mod zkmail_verification;

use zkmail_verification::verify_mail;

pub fn main(
    sender: [u8; 32],
    recipient: [u8; 32],
    message: [u8; 32],
    timestamp: u64,
    expected_sender_hash: [u8; 32],
    expected_recipient_hash: [u8; 32],
    expected_message_hash: [u8; 32],
    expected_timestamp: u64,
) -> pub bool {
    verify_mail(
        sender,
        recipient,
        message,
        timestamp,
        expected_sender_hash,
        expected_recipient_hash,
        expected_message_hash,
        expected_timestamp,
    )
}
