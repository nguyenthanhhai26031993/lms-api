/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `gia_dinh` (
    `id` CHAR(36) NOT NULL,
    `ten_gia_dinh` VARCHAR(191) NOT NULL,
    `pin_bam` VARCHAR(191) NOT NULL,
    `so_lan_sai_pin` INTEGER NOT NULL DEFAULT 0,
    `khoa_pin_den` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tai_khoan_phu_huynh` (
    `id` CHAR(36) NOT NULL,
    `gia_dinh_id` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phuong_thuc_dang_nhap` ENUM('EMAIL', 'GOOGLE') NOT NULL,
    `mat_khau_bam` VARCHAR(191) NULL,
    `lan_dang_nhap_cuoi` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tai_khoan_phu_huynh_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cau_hinh_gia_dinh` (
    `gia_dinh_id` CHAR(36) NOT NULL,
    `nguong_thuoc_bai` DECIMAL(3, 1) NOT NULL DEFAULT 8.0,
    `phut_moi_ngay` INTEGER NOT NULL DEFAULT 35,
    `so_cau_moi_ngay` INTEGER NOT NULL DEFAULT 20,
    `chu_ky_on_ngay` INTEGER NOT NULL DEFAULT 7,
    `sticker_len_cap` INTEGER NOT NULL DEFAULT 5,
    `ty_le_doi` INTEGER NULL,
    `bat_loa` BOOLEAN NOT NULL DEFAULT true,
    `muc_tieu_buoi_tuan` INTEGER NOT NULL DEFAULT 4,
    `tu_dieu_chinh_do_kho` BOOLEAN NOT NULL DEFAULT true,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`gia_dinh_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nhan_vat` (
    `id` CHAR(36) NOT NULL,
    `ten` VARCHAR(191) NOT NULL,
    `chu_de` ENUM('XE', 'BONG_DA', 'KHAC') NOT NULL,
    `loai` ENUM('AVATAR', 'STICKER') NOT NULL,
    `hinh_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ho_so_be` (
    `id` CHAR(36) NOT NULL,
    `gia_dinh_id` CHAR(36) NOT NULL,
    `ten_goi` VARCHAR(191) NOT NULL,
    `khoi_lop` VARCHAR(191) NOT NULL,
    `nhan_vat_id` CHAR(36) NOT NULL,
    `cap_nhan_vat` INTEGER NOT NULL DEFAULT 1,
    `so_thich` JSON NULL,
    `so_du_sticker` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ke_hoach` (
    `id` CHAR(36) NOT NULL,
    `gia_dinh_id` CHAR(36) NOT NULL,
    `mon` ENUM('MATHS', 'ENGLISH', 'SCIENCE') NOT NULL DEFAULT 'MATHS',
    `dang` ENUM('TEXT', 'IMAGE', 'FILE') NOT NULL,
    `tep_goc_url` VARCHAR(191) NULL,
    `noi_dung_chu` TEXT NULL,
    `da_xac_nhan` BOOLEAN NOT NULL DEFAULT false,
    `ngay_hoc` DATE NOT NULL,
    `trang_thai_soan` ENUM('CHUA_SOAN', 'DANG_SOAN', 'DA_SOAN', 'LOI') NOT NULL DEFAULT 'CHUA_SOAN',
    `loi_gan_nhat` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ke_hoach_gia_dinh_id_mon_ngay_hoc_key`(`gia_dinh_id`, `mon`, `ngay_hoc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bai` (
    `id` CHAR(36) NOT NULL,
    `ke_hoach_id` CHAR(36) NOT NULL,
    `chu_de` VARCHAR(191) NOT NULL,
    `ngay_du_kien` DATE NOT NULL,
    `trang_thai` ENUM('DRAFT', 'APPROVED', 'REMOVED') NOT NULL DEFAULT 'DRAFT',
    `duyet_luc` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cau_hoi` (
    `id` CHAR(36) NOT NULL,
    `bai_id` CHAR(36) NOT NULL,
    `thu_tu` INTEGER NOT NULL,
    `dang_cau` ENUM('CHON_DAP_AN', 'KEO_THA', 'DEM', 'DIEN_SO') NOT NULL,
    `do_kho` ENUM('DE', 'VUA', 'KHO') NOT NULL DEFAULT 'VUA',
    `noi_dung` TEXT NOT NULL,
    `lua_chon` JSON NULL,
    `dap_an` VARCHAR(191) NOT NULL,
    `goi_y_hinh` JSON NOT NULL,
    `giai_thich` TEXT NOT NULL,
    `trang_thai` ENUM('ACTIVE', 'REMOVED') NOT NULL DEFAULT 'ACTIVE',
    `sinh_lai_tu_id` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cau_hoi_sinh_lai_tu_id_key`(`sinh_lai_tu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lich_hoc` (
    `id` CHAR(36) NOT NULL,
    `be_id` CHAR(36) NOT NULL,
    `bai_id` CHAR(36) NOT NULL,
    `ngay_hoc` DATE NOT NULL,
    `loai` ENUM('MOI', 'ON') NOT NULL,
    `thu_tu` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `lich_hoc_be_id_ngay_hoc_idx`(`be_id`, `ngay_hoc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phien_hoc` (
    `id` CHAR(36) NOT NULL,
    `be_id` CHAR(36) NOT NULL,
    `bat_dau` DATETIME(3) NOT NULL,
    `ket_thuc` DATETIME(3) NULL,
    `so_giay_hoc` INTEGER NOT NULL DEFAULT 0,
    `da_nhac_nghi` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `luot_lam_bai` (
    `id` CHAR(36) NOT NULL,
    `lich_hoc_id` CHAR(36) NOT NULL,
    `phien_hoc_id` CHAR(36) NULL,
    `cau_hien_tai` INTEGER NOT NULL DEFAULT 1,
    `do_kho_hien_tai` ENUM('DE', 'VUA', 'KHO') NOT NULL DEFAULT 'VUA',
    `dem_dung_lien_tiep` INTEGER NOT NULL DEFAULT 0,
    `dem_sai_lien_tiep` INTEGER NOT NULL DEFAULT 0,
    `trang_thai` ENUM('DANG_LAM', 'HOAN_THANH') NOT NULL DEFAULT 'DANG_LAM',
    `diem_bai` DECIMAL(3, 1) NULL,
    `da_thuoc` BOOLEAN NULL,
    `hoan_thanh_luc` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tra_loi` (
    `id` CHAR(36) NOT NULL,
    `luot_lam_bai_id` CHAR(36) NOT NULL,
    `cau_hoi_id` CHAR(36) NOT NULL,
    `lan_1` VARCHAR(191) NULL,
    `lan_2` VARCHAR(191) NULL,
    `ket_qua` ENUM('FIRST', 'SECOND', 'WRONG') NULL,
    `diem_cau` DECIMAL(2, 1) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tra_loi_luot_lam_bai_id_cau_hoi_id_key`(`luot_lam_bai_id`, `cau_hoi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `muc_tieu_tuan` (
    `id` CHAR(36) NOT NULL,
    `be_id` CHAR(36) NOT NULL,
    `tuan_tu` DATE NOT NULL,
    `muc_tieu` INTEGER NOT NULL,
    `so_buoi_dat` INTEGER NOT NULL DEFAULT 0,
    `da_dat` BOOLEAN NULL,
    `chuoi_tuan` INTEGER NOT NULL DEFAULT 0,
    `tong_ket_luc` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `muc_tieu_tuan_be_id_tuan_tu_key`(`be_id`, `tuan_tu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lan_doi_thuong` (
    `id` CHAR(36) NOT NULL,
    `be_id` CHAR(36) NOT NULL,
    `so_sticker` INTEGER NOT NULL,
    `ty_le` INTEGER NOT NULL,
    `so_tien` INTEGER NOT NULL,
    `nguoi_ghi_id` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `giao_dich_sticker` (
    `id` CHAR(36) NOT NULL,
    `be_id` CHAR(36) NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `ly_do` ENUM('THUOC_BAI', 'DOI_THUONG', 'MUC_TIEU_TUAN', 'DIEU_CHINH') NOT NULL,
    `nhan_vat_id` CHAR(36) NULL,
    `luot_lam_bai_id` CHAR(36) NULL,
    `lan_doi_thuong_id` CHAR(36) NULL,
    `muc_tieu_tuan_id` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `giao_dich_sticker_be_id_created_at_idx`(`be_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tai_khoan_phu_huynh` ADD CONSTRAINT `tai_khoan_phu_huynh_gia_dinh_id_fkey` FOREIGN KEY (`gia_dinh_id`) REFERENCES `gia_dinh`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cau_hinh_gia_dinh` ADD CONSTRAINT `cau_hinh_gia_dinh_gia_dinh_id_fkey` FOREIGN KEY (`gia_dinh_id`) REFERENCES `gia_dinh`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ho_so_be` ADD CONSTRAINT `ho_so_be_gia_dinh_id_fkey` FOREIGN KEY (`gia_dinh_id`) REFERENCES `gia_dinh`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ho_so_be` ADD CONSTRAINT `ho_so_be_nhan_vat_id_fkey` FOREIGN KEY (`nhan_vat_id`) REFERENCES `nhan_vat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ke_hoach` ADD CONSTRAINT `ke_hoach_gia_dinh_id_fkey` FOREIGN KEY (`gia_dinh_id`) REFERENCES `gia_dinh`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bai` ADD CONSTRAINT `bai_ke_hoach_id_fkey` FOREIGN KEY (`ke_hoach_id`) REFERENCES `ke_hoach`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cau_hoi` ADD CONSTRAINT `cau_hoi_bai_id_fkey` FOREIGN KEY (`bai_id`) REFERENCES `bai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cau_hoi` ADD CONSTRAINT `cau_hoi_sinh_lai_tu_id_fkey` FOREIGN KEY (`sinh_lai_tu_id`) REFERENCES `cau_hoi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_hoc` ADD CONSTRAINT `lich_hoc_be_id_fkey` FOREIGN KEY (`be_id`) REFERENCES `ho_so_be`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_hoc` ADD CONSTRAINT `lich_hoc_bai_id_fkey` FOREIGN KEY (`bai_id`) REFERENCES `bai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phien_hoc` ADD CONSTRAINT `phien_hoc_be_id_fkey` FOREIGN KEY (`be_id`) REFERENCES `ho_so_be`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `luot_lam_bai` ADD CONSTRAINT `luot_lam_bai_lich_hoc_id_fkey` FOREIGN KEY (`lich_hoc_id`) REFERENCES `lich_hoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `luot_lam_bai` ADD CONSTRAINT `luot_lam_bai_phien_hoc_id_fkey` FOREIGN KEY (`phien_hoc_id`) REFERENCES `phien_hoc`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tra_loi` ADD CONSTRAINT `tra_loi_luot_lam_bai_id_fkey` FOREIGN KEY (`luot_lam_bai_id`) REFERENCES `luot_lam_bai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tra_loi` ADD CONSTRAINT `tra_loi_cau_hoi_id_fkey` FOREIGN KEY (`cau_hoi_id`) REFERENCES `cau_hoi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `muc_tieu_tuan` ADD CONSTRAINT `muc_tieu_tuan_be_id_fkey` FOREIGN KEY (`be_id`) REFERENCES `ho_so_be`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lan_doi_thuong` ADD CONSTRAINT `lan_doi_thuong_be_id_fkey` FOREIGN KEY (`be_id`) REFERENCES `ho_so_be`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lan_doi_thuong` ADD CONSTRAINT `lan_doi_thuong_nguoi_ghi_id_fkey` FOREIGN KEY (`nguoi_ghi_id`) REFERENCES `tai_khoan_phu_huynh`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `giao_dich_sticker` ADD CONSTRAINT `giao_dich_sticker_be_id_fkey` FOREIGN KEY (`be_id`) REFERENCES `ho_so_be`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `giao_dich_sticker` ADD CONSTRAINT `giao_dich_sticker_nhan_vat_id_fkey` FOREIGN KEY (`nhan_vat_id`) REFERENCES `nhan_vat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `giao_dich_sticker` ADD CONSTRAINT `giao_dich_sticker_luot_lam_bai_id_fkey` FOREIGN KEY (`luot_lam_bai_id`) REFERENCES `luot_lam_bai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `giao_dich_sticker` ADD CONSTRAINT `giao_dich_sticker_lan_doi_thuong_id_fkey` FOREIGN KEY (`lan_doi_thuong_id`) REFERENCES `lan_doi_thuong`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `giao_dich_sticker` ADD CONSTRAINT `giao_dich_sticker_muc_tieu_tuan_id_fkey` FOREIGN KEY (`muc_tieu_tuan_id`) REFERENCES `muc_tieu_tuan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
