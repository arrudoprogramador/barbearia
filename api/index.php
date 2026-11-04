<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data.json';

// Initialize data.json if not present
if (!file_exists($dataFile)) {
    $initialData = [
        "settings" => [
            "fantasy_name" => "Barbearia Ferreira",
            "subtitle" => "Especialistas em cortes modernos, degradê e barba alinhada",
            "phone" => "(11) 98765-4321",
            "whatsapp" => "5511987654321",
            "instagram" => "barbeariaferreira_oficial",
            "avatar" => "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
            "banner" => "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
            "address" => [
                "street" => "Estrada de Poá",
                "number" => "38",
                "neighbourhood" => "Guaianases",
                "city" => "São Paulo",
                "state" => "SP",
                "maps_url" => "https://maps.google.com/?q=Estrada+de+Poa+38+Guaianases+Sao+Paulo"
            ],
            "theme" => [
                "primary_color" => "#0F172A",
                "accent_color" => "#D97706",
                "bg_style" => "clean-light"
            ],
            "booking_rules" => [
                "slot_interval_minutes" => 30,
                "min_notice_hours" => 1,
                "cancellation_notice_hours" => 12,
                "cancellation_policy" => "Reembolso até 12 hrs antes, sem devolução do sinal.",
                "tolerance_late_minutes" => 10,
                "allow_client_cancel" => true
            ],
            "manual_messages" => [
                "appointment_confirmation" => "Olá {cliente}, tudo bem?\n\nSeu agendamento na *{fantasia}* está confirmado!\n\n📅 *Data:* {data}\n⏰ *Horário:* {horario}\n✂️ *Serviço(s):* {servicos}\n💈 *Profissional:* {profissional}\n💰 *Valor Total:* {valor_total}\n📍 *Local:* {endereco}\n\n⚠️ *Atenção:* Tolerância máxima de {tolerancia} minutos de atraso.\nEstamos te aguardando!",
                "cancellation" => "Olá {cliente}, seu agendamento para {data} às {horario} foi cancelado com sucesso.\nEm caso de dúvidas, nos contate pelo WhatsApp: {whatsapp}.",
                "reminder" => "Olá {cliente}! Passando para lembrar do seu horário hoje ({data}) às {horario} na *{fantasia}*! Até já!"
            ],
            "admin_credentials" => [
                "password_hash" => "admin123"
            ]
        ],
        "services" => [
            [
                "id" => "srv-corte",
                "title" => "CORTE",
                "description" => "Corte completo com tesoura e máquina, finalização com pomada e alinhamento impecável.",
                "price" => 35.00,
                "duration" => 35,
                "category" => "Cabelo",
                "photo" => "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
                "popular" => true,
                "active" => true
            ],
            [
                "id" => "srv-corte-barba",
                "title" => "CORTE & BARBA",
                "description" => "O combo mais pedido: corte estilizado completo + terapia de barba com toalha quente e navalha.",
                "price" => 50.00,
                "duration" => 50,
                "category" => "Combos",
                "photo" => "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
                "popular" => true,
                "active" => true
            ],
            [
                "id" => "srv-barba",
                "title" => "BARBA COMPLETA",
                "description" => "Desenho da barba com navalha, toalha quente, pós-barba refrescante e hidratação.",
                "price" => 20.00,
                "duration" => 25,
                "category" => "Barba",
                "photo" => "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
                "popular" => false,
                "active" => true
            ]
        ],
        "barbers" => [
            [
                "id" => "barber-1",
                "name" => "Bruno Vinicius da Silva Lopes",
                "nickname" => "Bruno Lopes",
                "role" => "Barbeiro Master & Proprietário",
                "photo" => "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "phone" => "(11) 98765-4321",
                "active" => true,
                "week_schedule" => [
                    "monday" => ["day_on" => false, "opens_at" => "10:00", "closes_at" => "19:00", "lunch_start" => "13:00", "lunch_end" => "14:30"],
                    "tuesday" => ["day_on" => true, "opens_at" => "09:00", "closes_at" => "19:00", "lunch_start" => "13:00", "lunch_end" => "14:30"],
                    "wednesday" => ["day_on" => true, "opens_at" => "09:00", "closes_at" => "19:30", "lunch_start" => "13:00", "lunch_end" => "14:30"],
                    "thursday" => ["day_on" => true, "opens_at" => "09:00", "closes_at" => "19:30", "lunch_start" => "13:00", "lunch_end" => "14:30"],
                    "friday" => ["day_on" => true, "opens_at" => "09:00", "closes_at" => "20:00", "lunch_start" => "13:00", "lunch_end" => "14:30"],
                    "saturday" => ["day_on" => true, "opens_at" => "09:00", "closes_at" => "20:00", "lunch_start" => "13:00", "lunch_end" => "14:30"],
                    "sunday" => ["day_on" => true, "opens_at" => "09:00", "closes_at" => "14:00", "lunch_start" => "", "lunch_end" => ""]
                ]
            ]
        ],
        "appointments" => []
    ];
    file_put_contents($dataFile, json_encode($initialData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function loadData($file) {
    if (!file_exists($file)) return [];
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

function saveData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$store = loadData($dataFile);

switch ($action) {
    case 'get_settings':
        echo json_encode($store['settings'] ?? []);
        break;

    case 'save_settings':
        $store['settings'] = $input;
        saveData($dataFile, $store);
        echo json_encode(["success" => true, "settings" => $store['settings']]);
        break;

    case 'get_services':
        echo json_encode($store['services'] ?? []);
        break;

    case 'save_services':
        $store['services'] = $input;
        saveData($dataFile, $store);
        echo json_encode(["success" => true, "services" => $store['services']]);
        break;

    case 'get_barbers':
        echo json_encode($store['barbers'] ?? []);
        break;

    case 'save_barbers':
        $store['barbers'] = $input;
        saveData($dataFile, $store);
        echo json_encode(["success" => true, "barbers" => $store['barbers']]);
        break;

    case 'get_appointments':
        echo json_encode($store['appointments'] ?? []);
        break;

    case 'create_appointment':
        if (!isset($store['appointments'])) {
            $store['appointments'] = [];
        }
        array_unshift($store['appointments'], $input);
        saveData($dataFile, $store);
        echo json_encode(["success" => true, "appointment" => $input]);
        break;

    case 'update_appointment_status':
        $id = $input['id'] ?? '';
        $status = $input['status'] ?? '';
        if (isset($store['appointments'])) {
            foreach ($store['appointments'] as &$apt) {
                if ($apt['id'] === $id) {
                    $apt['status'] = $status;
                    break;
                }
            }
        }
        saveData($dataFile, $store);
        echo json_encode(["success" => true]);
        break;

    case 'delete_appointment':
        $id = $input['id'] ?? '';
        if (isset($store['appointments'])) {
            $store['appointments'] = array_values(array_filter($store['appointments'], function($a) use ($id) {
                return $a['id'] !== $id;
            }));
        }
        saveData($dataFile, $store);
        echo json_encode(["success" => true]);
        break;

    default:
        echo json_encode([
            "name" => "Barber Booking API",
            "status" => "online",
            "version" => "1.0",
            "storage_file" => basename($dataFile)
        ]);
        break;
}

