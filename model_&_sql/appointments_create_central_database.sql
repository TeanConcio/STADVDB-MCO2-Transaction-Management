-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema STADVDB-MCO2-Central
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `STADVDB-MCO2-Central` ;

-- -----------------------------------------------------
-- Schema STADVDB-MCO2-Central
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `STADVDB-MCO2-Central` DEFAULT CHARACTER SET utf8 ;
USE `STADVDB-MCO2-Central` ;

-- -----------------------------------------------------
-- Table `STADVDB-MCO2-Central`.`appointments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `STADVDB-MCO2-Central`.`appointments` ;

CREATE TABLE IF NOT EXISTS `STADVDB-MCO2-Central`.`appointments` (
  `apt_id` INT NOT NULL,
  `patient_name` VARCHAR(64) NOT NULL,
  `patient_age` INT NOT NULL,
  `doctor_name` VARCHAR(64) NOT NULL,
  `doctor_specialty` VARCHAR(64) NOT NULL,
  `clinic_name` VARCHAR(64) NOT NULL,
  `clinic_city` VARCHAR(64) NOT NULL,
  `island_group` ENUM('Luzon', 'Visayas', 'Mindanao') NOT NULL,
  `appointment_date` DATE NOT NULL,
  `appointment_status` ENUM("Cancel", "Complete", "NoShow", "Queued", "Serving", "Skip") NOT NULL,
  `time_queued` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`apt_id`),
  UNIQUE INDEX `apt_id_UNIQUE` (`apt_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `STADVDB-MCO2-Central`.`luzon_log`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `STADVDB-MCO2-Central`.`luzon_log` ;

CREATE TABLE IF NOT EXISTS `STADVDB-MCO2-Central`.`luzon_log` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `operation` ENUM("INSERT", "UPDATE", "DELETE") NOT NULL,
  `apt_id` INT NOT NULL,
  `patient_name` VARCHAR(64) NULL,
  `patient_age` INT NULL,
  `doctor_name` VARCHAR(64) NULL,
  `doctor_specialty` VARCHAR(64) NULL,
  `clinic_name` VARCHAR(64) NULL,
  `clinic_city` VARCHAR(64) NULL,
  `island_group` ENUM('Luzon', 'Visayas', 'Mindanao') NULL,
  `appointment_date` DATE NULL,
  `appointment_status` ENUM("Cancel", "Complete", "NoShow", "Queued", "Serving", "Skip") NULL,
  `time_queued` DATETIME NULL,
  PRIMARY KEY (`log_id`),
  UNIQUE INDEX `log_id_UNIQUE` (`log_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `STADVDB-MCO2-Central`.`vismin_log`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `STADVDB-MCO2-Central`.`vismin_log` ;

CREATE TABLE IF NOT EXISTS `STADVDB-MCO2-Central`.`vismin_log` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `operation` ENUM("INSERT", "UPDATE", "DELETE") NOT NULL,
  `apt_id` INT NOT NULL,
  `patient_name` VARCHAR(64) NULL,
  `patient_age` INT NULL,
  `doctor_name` VARCHAR(64) NULL,
  `doctor_specialty` VARCHAR(64) NULL,
  `clinic_name` VARCHAR(64) NULL,
  `clinic_city` VARCHAR(64) NULL,
  `island_group` ENUM('Luzon', 'Visayas', 'Mindanao') NULL,
  `appointment_date` DATE NULL,
  `appointment_status` ENUM("Cancel", "Complete", "NoShow", "Queued", "Serving", "Skip") NULL,
  `time_queued` DATETIME NULL,
  PRIMARY KEY (`log_id`),
  UNIQUE INDEX `log_id_UNIQUE` (`log_id` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
