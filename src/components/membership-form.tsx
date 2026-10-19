"use client";

import { useState, type FormEvent } from "react";
import { TextAreaField, TextField } from "@/components/form";

const ADMIN_WHATSAPP = "62881022188667";

export function MembershipForm() {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const interests = String(formData.get("interests") ?? "").trim();

    const message = [
      "Halo Admin FestivalTukarBuku, saya ingin mendaftar menjadi anggota.",
      "",
      `Nama lengkap: ${name}`,
      `Nomor WhatsApp: ${phone}`,
      `Alamat domisili: ${address || "Belum diisi"}`,
      `Minat bacaan: ${interests || "Belum diisi"}`,
    ].join("\n");
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

    setWhatsappUrl(url);
    const whatsappWindow = window.open(url, "_blank");
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      setStatus("WhatsApp dibuka dengan draf pesan pendaftaran kamu.");
    } else {
      setStatus("Pop-up terblokir. Lanjutkan pendaftaran melalui tombol di bawah.");
    }
  }

  function clearGeneratedMessage() {
    setWhatsappUrl("");
    setStatus("");
  }

  return (
    <form className="membership-form" onSubmit={handleSubmit} onChange={clearGeneratedMessage}>
      <div className="membership-form-heading">
        <p className="eyebrow">FORMULIR KEANGGOTAAN</p>
        <h2>Kenalan dulu, yuk.</h2>
        <p>Isi data berikut. Pesan pendaftaran akan disiapkan untuk dikirim ke admin melalui WhatsApp.</p>
      </div>
      <div className="membership-fields">
        <TextField
          id="membership-name"
          name="name"
          label="Nama lengkap *"
          autoComplete="name"
          placeholder="Nama sesuai identitas"
          required
          maxLength={100}
        />
        <TextField
          id="membership-phone"
          name="phone"
          type="tel"
          label="Nomor WhatsApp *"
          autoComplete="tel"
          placeholder="Contoh: 08xx xxxx xxxx"
          pattern="[0-9+() .-]{8,20}"
          title="Masukkan nomor telepon yang valid."
          required
        />
        <TextAreaField
          id="membership-address"
          name="address"
          label="Alamat domisili"
          optional
          autoComplete="street-address"
          placeholder="Kecamatan/kota tempat tinggal"
          maxLength={240}
        />
        <TextAreaField
          id="membership-interests"
          name="interests"
          label="Minat bacaan"
          optional
          placeholder="Genre atau buku yang kamu sukai"
          maxLength={240}
        />
      </div>
      <p className="membership-privacy-note">
        Data ini tidak disimpan oleh situs. Data hanya dimasukkan ke draf pesan WhatsApp agar kamu dapat memeriksanya sebelum mengirim.
      </p>
      <button className="button button-primary membership-submit" type="submit">
        Siapkan pendaftaran via WhatsApp <span aria-hidden="true">↗</span>
      </button>
      {status ? (
        <div className="membership-form-status" aria-live="polite">
          <p>{status}</p>
          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Buka WhatsApp <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
