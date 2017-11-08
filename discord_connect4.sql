-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  mer. 08 nov. 2017 à 18:04
-- Version du serveur :  10.0.30-MariaDB-0+deb8u1
-- Version de PHP :  7.0.18-1~dotdeb+8.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `discord_connect4`
--

-- --------------------------------------------------------

--
-- Structure de la table `channel_blacklisted`
--

CREATE TABLE `channel_blacklisted` (
  `channel_id` varchar(25) NOT NULL,
  `guild_id` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Structure de la table `channel_whitelist`
--

CREATE TABLE `channel_whitelist` (
  `channel_id` varchar(25) NOT NULL,
  `guild_id` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `number_party_started`
--

CREATE TABLE `number_party_started` (
  `date` date NOT NULL,
  `number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `channel_blacklisted`
--
ALTER TABLE `channel_blacklisted`
  ADD PRIMARY KEY (`channel_id`);

--
-- Index pour la table `channel_whitelist`
--
ALTER TABLE `channel_whitelist`
  ADD PRIMARY KEY (`channel_id`);

--
-- Index pour la table `number_party_started`
--
ALTER TABLE `number_party_started`
  ADD PRIMARY KEY (`date`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
